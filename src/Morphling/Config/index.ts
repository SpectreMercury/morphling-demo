import { BI } from "../base/number";
import { Config } from "../types/config";

const MainnetConfig: Config = {
  PREFIX: "ckb",
  SCRIPTS: {
    SECP256K1_BLAKE160: {
      CODE_HASH:
        "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
      HASH_TYPE: "type",
      TX_HASH:
        "0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c",
      INDEX: "0x0",
      DEP_TYPE: "depGroup",
      SHORT_ID: 0,
    },
    SECP256K1_BLAKE160_MULTISIG: {
      CODE_HASH:
        "0x5c5069eb0857efc65e1bca0c07df34c31663b3622fd3876c876320fc9634e2a8",
      HASH_TYPE: "type",
      TX_HASH:
        "0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c",
      INDEX: "0x1",
      DEP_TYPE: "depGroup",
      SHORT_ID: 1,
    },
    DAO: {
      CODE_HASH:
        "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
      HASH_TYPE: "type",
      TX_HASH:
        "0xe2fb199810d49a4d8beec56718ba2593b665db9d52299a0f9e6e75416d73ff5c",
      INDEX: "0x2",
      DEP_TYPE: "code",
    },
    SUDT: {
      CODE_HASH:
        "0x5e7a36a77e68eecc013dfa2fe6a23f3b6c344b04005808694ae6dd45eea4cfd5",
      HASH_TYPE: "type",
      TX_HASH:
        "0xc7813f6a415144643970c2e88e0bb6ca6a8edc5dd7c1022746f628284a9936d5",
      INDEX: "0x0",
      DEP_TYPE: "code",
    },
    ANYONE_CAN_PAY: {
      CODE_HASH:
        "0xd369597ff47f29fbc0d47d2e3775370d1250b85140c670e4718af712983a2354",
      HASH_TYPE: "type",
      TX_HASH:
        "0x4153a2014952d7cac45f285ce9a7c5c0c0e1b21f2d378b82ac1433cb11c25c4d",
      INDEX: "0x0",
      DEP_TYPE: "depGroup",
      SHORT_ID: 2,
    },
    OMNILOCK: {
      CODE_HASH:
        "0x9b819793a64463aed77c615d6cb226eea5487ccfc0783043a587254cda2b6f26",
      HASH_TYPE: "type",
      TX_HASH:
        "0xc76edf469816aa22f416503c38d0b533d2a018e253e379f134c3985b3472c842",
      INDEX: "0x0",
      DEP_TYPE: "code",
    },
    JOYIDLOCK: {
      CODE_HASH:
        "0xd00c84f0ec8fd441c38bc3f87a371f547190f2fcff88e642bc5bf54b9e318323",
      HASH_TYPE: "type",
      TX_HASH:
        "0xf05188e5f3a6767fc4687faf45ba5f1a6e25d3ada6129dae8722cb282f262493",
      INDEX: "0x0",
      DEP_TYPE: "depGroup",
    },
  },
};

const TestnetConig: Config = {
  PREFIX: "ckt",
  SCRIPTS: {
    SECP256K1_BLAKE160: {
      CODE_HASH:
        "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
      HASH_TYPE: "type",
      TX_HASH:
        "0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37",
      INDEX: "0x0",
      DEP_TYPE: "depGroup",
      SHORT_ID: 0,
    },
    SECP256K1_BLAKE160_MULTISIG: {
      CODE_HASH:
        "0x5c5069eb0857efc65e1bca0c07df34c31663b3622fd3876c876320fc9634e2a8",
      HASH_TYPE: "type",
      TX_HASH:
        "0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37",
      INDEX: "0x1",
      DEP_TYPE: "depGroup",
      SHORT_ID: 1,
    },
    DAO: {
      CODE_HASH:
        "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
      HASH_TYPE: "type",
      TX_HASH:
        "0x8f8c79eb6671709633fe6a46de93c0fedc9c1b8a6527a18d3983879542635c9f",
      INDEX: "0x2",
      DEP_TYPE: "code",
    },
    SUDT: {
      CODE_HASH:
        "0xc5e5dcf215925f7ef4dfaf5f4b4f105bc321c02776d6e7d52a1db3fcd9d011a4",
      HASH_TYPE: "type",
      TX_HASH:
        "0xe12877ebd2c3c364dc46c5c992bcfaf4fee33fa13eebdf82c591fc9825aab769",
      INDEX: "0x0",
      DEP_TYPE: "code",
    },
    ANYONE_CAN_PAY: {
      CODE_HASH:
        "0x3419a1c09eb2567f6552ee7a8ecffd64155cffe0f1796e6e61ec088d740c1356",
      HASH_TYPE: "type",
      TX_HASH:
        "0xec26b0f85ed839ece5f11c4c4e837ec359f5adc4420410f6453b1f6b60fb96a6",
      INDEX: "0x0",
      DEP_TYPE: "depGroup",
      SHORT_ID: 2,
    },
    OMNILOCK: {
      CODE_HASH:
        "0xf329effd1c475a2978453c8600e1eaf0bc2087ee093c3ee64cc96ec6847752cb",
      HASH_TYPE: "type",
      TX_HASH:
        "0x3d4296df1bd2cc2bd3f483f61ab7ebeac462a2f336f2b944168fe6ba5d81c014",
      INDEX: "0x0",
      DEP_TYPE: "code",
    },
    JOYIDLOCK: {
      CODE_HASH:
        "0xd23761b364210735c19c60561d213fb3beae2fd6172743719eff6920e020baac",
      HASH_TYPE: "type",
      TX_HASH:
        "0x4dcf3f3b09efac8995d6cbee87c5345e812d310094651e0c3d9a730f32dc9263",
      INDEX: "0x0",
      DEP_TYPE: "depGroup",
    },
  },
};

export const MainnetRPC: string = "https://mainnet.ckbapp.dev/";
export const MainnetRPCBackup: string = "https://mainnet.ckbapp.dev/";
export const TestnetRPC: string = "https://testnet.ckbapp.dev/";
export const TestnetRPCBackup: string = "https://testnet.ckb.dev/";

export const MAX_FEE = BI.from(2000_0000);

export const DefaultConfig = {
  MainnetConfig,
  TestnetConig,
};
