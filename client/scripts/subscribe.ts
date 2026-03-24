import dotenv from "dotenv";
import { SDK } from "@somnia-chain/reactivity";
import {
  createPublicClient,
  createWalletClient,
  http,
  parseGwei,
  keccak256,
  toBytes,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { somniaTestnet } from "../src/lib/somnia";

dotenv.config();

const privateKey = process.env.PRIVATE_KEY;
const sominiaRpc = process.env.VITE_SOMNIA_RPC_URL;
const guardianMonitorAddress = process.env.VITE_GUARDIAN_MONITOR_ADDRESS;
const positionRegistryAddress = process.env.VITE_POSITION_REGISTRY_ADDRESS;

if (!privateKey) throw new Error("PRIVATE_KEY is not set in .env");
if (!sominiaRpc) throw new Error("VITE_SOMNIA_RPC_URL is not set in .env");
if (!guardianMonitorAddress)
  throw new Error("VITE_GUARDIAN_MONITOR_ADDRESS is not set in .env");
if (!positionRegistryAddress)
  throw new Error("VITE_POSITION_REGISTRY_ADDRESS is not set in .env");

const account = privateKeyToAccount(
  (privateKey.startsWith("0x")
    ? privateKey
    : `0x${privateKey}`) as `0x${string}`,
);

const publicClient = createPublicClient({
  chain: somniaTestnet,
  transport: http(sominiaRpc),
});

const walletClient = createWalletClient({
  account,
  chain: somniaTestnet,
  transport: http(sominiaRpc),
});

const sdk = new SDK({ public: publicClient, wallet: walletClient });

// Somnia system precompile address — source of BlockTick events
// Reactive tx is executed by validator address - 0x0000000000000000000000000000000000000100
// const SOMNIA_REACTIVITY_PRECOMPILE =
// ("0x0000000000000000000000000000000000000100");
// const BLOCK_TICK_SELECTOR = keccak256(toBytes("BlockTick(uint64)"));

async function main() {
  console.log("Creating subscriptions for Liquidation Guardian...");
  console.log("Handler:", guardianMonitorAddress);

  // Fires whenever a user registers or updates a position
  // console.log("\n1. Creating PositionRegistry subscription...");

  // const sub1 = await sdk.createSoliditySubscription({
  //   handlerContractAddress: guardianMonitorAddress as `0x${string}`,
  //   emitter: positionRegistryAddress as `0x${string}`,
  //   // eventTopics:[PositionRegistered and PositionUpdated], precision to avoid wasting gas on deleteEvents
  //   priorityFeePerGas: parseGwei("2"),
  //   maxFeePerGas: parseGwei("10"),
  //   gasLimit: 3_000_000n,
  //   isGuaranteed: true,
  //   isCoalesced: false,
  // });

  // if (sub1 instanceof Error) {
  //   console.error("Sub 1 failed:", sub1.message);
  //   process.exit(1);
  // }

  // const receipt1 = await publicClient.waitForTransactionReceipt({ hash: sub1 });
  // console.log("✅ PositionRegistry subscription created:", sub1);
  // console.log("Sub 1 receipt:", receipt1);
  // console.log("Receipt1:", receipt1.status);

  // Fires every block (~10x per second on Somnia)
  // This catches price drops without any user action
  console.log("\n2. Creating BlockTick subscription...");

  // const sub2 = await sdk.createSoliditySubscription({
  //   handlerContractAddress: guardianMonitorAddress as `0x${string}`,
  //   emitter: SOMNIA_REACTIVITY_PRECOMPILE as `0x${string}`,
  //   eventTopics: [BLOCK_TICK_SELECTOR as `0x${string}`],
  //   priorityFeePerGas: parseGwei("2"),
  //   maxFeePerGas: parseGwei("10"),
  //   gasLimit: 3_000_000n,
  //   isGuaranteed: true,
  //   isCoalesced: false,
  // });

  // const sub2 = await sdk.createOnchainBlockTickSubscription({
  //   handlerContractAddress: guardianMonitorAddress as `0x${string}`,
  //   priorityFeePerGas: parseGwei("2"),
  //   maxFeePerGas: parseGwei("10"),
  //   gasLimit: 3_000_000n,
  //   isGuaranteed: true,
  //   isCoalesced: false,
  // });

  // if (sub2 instanceof Error) {
  //   console.error("Sub 2 failed:", sub2.message);
  //   process.exit(1);
  // }

  // console.log("✅ BlockTick subscription created:", sub2);
  // const receipt2 = await publicClient.waitForTransactionReceipt({ hash: sub2 });
  // console.log("Tx:", receipt2);
  // console.log("Receipt:", receipt2.status);

  try {
    const txHash = await sdk.createOnchainBlockTickSubscription({
      blockNumber: BigInt(10),
      handlerContractAddress: guardianMonitorAddress as `0x${string}`,
      // Optional: Override default handler selector (defaults to onEvent)
      // handlerFunctionSelector: '0xYourSelector',
      priorityFeePerGas: BigInt(1000000000), // 1 nanoSOMI
      maxFeePerGas: BigInt(10000000000), // 10 nanoSOMI
      gasLimit: BigInt(2000000),
      isGuaranteed: true, // Ensure delivery even if delayed
      isCoalesced: false, // Handle each event separately
    });
    console.log("Subscription created with tx hash:", txHash);
  } catch (error) {
    console.error("Error creating subscription:", error);
  }

  console.log("\n🛡 Liquidation Guardian is live!");
  console.log("   Watching PositionRegistry for position changes");
  console.log("   Scanning all positions every 10 blocks for price drops");
  console.log(
    "\n   Save these tx hashes — you'll need them to query or cancel subscriptions.",
  );
}
// main();

async function setupBlockTick() {
  try {
    const txHash = await sdk.createOnchainBlockTickSubscription({
      blockNumber: BigInt(10),
      handlerContractAddress: guardianMonitorAddress as `0x${string}`,
      priorityFeePerGas: BigInt(1000000000),
      maxFeePerGas: BigInt(10000000000),
      gasLimit: BigInt(2000000),
      isGuaranteed: true,
      isCoalesced: false,
    });

    console.log("Subscription created with tx hash:", txHash);
  } catch (error) {
    console.error("Error creating subscription:", error);
  }
}

setupBlockTick();
