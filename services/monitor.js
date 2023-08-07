const Arweave = require("arweave");
const { getUser, sendMail } = require("./arweave-mailer.js");

const monitor = async () => {
  const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
    network: "testnet",
  });

  const MEGA_BYTE = 1024 * 1024;
  const TRACKING_BLOCKS_NUM = 20; // TODO: env
  const { height: currentBlockHeight } = await arweave.blocks.getCurrent();
  let blockHeight = Number(currentBlockHeight) - TRACKING_BLOCKS_NUM;

  while (true) {
    const blockInfo = await arweave.blocks.getByHeight(blockHeight);

    if (
      !blockInfo.txs ||
      !Array.isArray(blockInfo.txs) ||
      blockInfo.txs.length < 1
    ) {
      blockHeight++;
      continue;
    }

    const transactionTimestamp = blockInfo.timestamp;

    for (const transaction of blockInfo.txs) {
      console.log(
        `Fetching details for transaction hash: [${transaction}][${blockHeight}]`
      );

      const transactionDetail = await arweave.transactions.get(transaction);
      const sender = await arweave.wallets.ownerToAddress(
        transactionDetail.owner
      );
      const receiver = transactionDetail.target;
      const amount = arweave.ar.winstonToAr(transactionDetail.quantity);
      const transactionFee = arweave.ar.winstonToAr(transactionDetail.reward);
      const dataSize = transactionDetail.data_size / MEGA_BYTE;
      const transactionTags = transactionDetail.tags.map((tag) => {
        const key = tag.get("name", { decode: true, string: true });
        const value = tag.get("value", { decode: true, string: true });

        return { [key]: value };
      });

      // Check if sender is a subscriber
      const senderData = await getUser(sender);

      if (senderData) {
        // Send mail
        await sendMail({
          sender,
          receiver,
          amount,
          transactionFee,
          transactionTimestamp,
          dataSize,
          transactionTags,
          transactionId: transaction,
          userData: {
            firstName: senderData.first_name,
            email: senderData.email,
            walletAddress: senderData.wallet_address,
          },
        });
      }

      const receiverData = receiver ? await getUser(receiver) : null;

      if (receiverData) {
        // Send mail
        await sendMail({
          sender,
          receiver,
          amount,
          transactionFee,
          transactionTimestamp,
          dataSize,
          transactionTags,
          transactionId: transaction,
          userData: {
            firstName: receiverData.first_name,
            email: receiverData.email,
            walletAddress: receiverData.wallet_address,
          },
        });
      }
    }

    blockHeight++;

    // Check if blockHeight >= current blockchain height
    const { height: currentBlockHeight } = await arweave.blocks.getCurrent();
    if (blockHeight >= Number(currentBlockHeight)) {
      blockHeight = Number(currentBlockHeight) - TRACKING_BLOCKS_NUM;
      console.log(`Resetting block height to ${blockHeight}`);
    }
  }
};

module.exports = monitor;
