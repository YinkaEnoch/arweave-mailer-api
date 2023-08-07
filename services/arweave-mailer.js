require("dotenv").config();
const connection = require("../knex/knexfile.js");
const knex = require("knex")(connection);
const { Resend } = require("resend");

const createSubscription = async (req, res) => {
  const { firstName, email, walletAddress } = req.body;

  try {
    const userExists = await getUser(walletAddress);

    if (userExists && userExists.length > 0) {
      return res
        .status(400)
        .json({ error: true, message: "Wallet address already exists" });
    }

    await knex
      .table("mail_subscription")
      .insert({ first_name: firstName, email, wallet_address: walletAddress });

    res
      .status(201)
      .json({ code: 0, status: "OK", message: "Subscription successful" });
  } catch (err) {
    res.status(500).json({ error: true, message: err?.message });
  }
};

const getUser = async (walletAddress) => {
  try {
    const data = await knex.raw(
      `SELECT first_name, email, wallet_address FROM mail_subscription WHERE wallet_address='${walletAddress}'`
    );

    console.log({ data });

    return data[0];
  } catch (err) {
    return err;
  }
};

const sendMail = async (mailData) => {
  const {
    sender,
    receiver,
    amount,
    transactionFee,
    transactionTimestamp,
    dataSize,
    transactionTags,
    transactionId,
    userData,
  } = mailData;

  const emailBody = `
  <p>Dear <span style="text-transform: 'capitalize'">${
    userData.firstName
  }</span>,</p>
  <p>This is to notify you of an on-chain transaction involving your wallet address <em>${
    userData.walletAddress
  }</em>. The details of the transaction are as follows: </p>
  <p><strong>Transaction ID: </strong>${transactionId}</p>
  <p><strong>Date and Time: </strong>${new Date(
    transactionTimestamp * 1000
  ).toLocaleString()}</p>
  <p><strong>Sender: </strong>${sender}</p>
  <p><strong>Receiver: </strong>${receiver || "-"}</p>
  <p><strong>Amount: </strong>${parseFloat(amount) || "-"} AR</p>
  <p><strong>Transaction Fee: </strong>${transactionFee}</p>
  <p><strong>Data Size(mb): </strong>${dataSize || "-"}</p>
  <p><strong>Transaction Tags: </strong></p>
  <ul>
    ${transactionTags
      .map((tag) => {
        const item = Object.entries(tag);
        return `<li>${item[0][0]}: ${item[0][1]}</li>`;
      })
      .join("\n")}
  </ul>
  <p>Please review the details mentioned above. If you initiated this transaction, there's no further action required from your end.</p>
  <p>If you didn't initiate this transaction or notice any suspicious activity, we strongly recommend taking concrete steps to ensure the security of your account.</p>
  <p>Best regards,</p>
  <p>Arweave Mailer Team</p><br/><br/>
  <p>Note: This email is for informational purposes only. We will never ask for sensitive account information via email. If you receive any suspicious emails, do not click on any links or provide any personal information. Always access your account through our official website.</p>
  `;

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "Arweave Mailer <onboarding@resend.dev>",
    to: userData.email,
    subject: "Arweave On-chain Transaction Alert",
    html: emailBody,
  });
};

module.exports = { createSubscription, getUser, sendMail };
