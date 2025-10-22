export interface ChainLinks {
  related?: string;
  self?: string;
  [key: string]: unknown;
}

export interface ChainData {
  type: string;
  id: string;
}

export interface Chain {
  type: "chains";
  id: string;
  attributes: {
    external_id: string;
    name: string;
    icon: {
      url: string;
    };
    explorer: {
      name: string;
      token_url_format: string;
      tx_url_format: string;
      home_url: string;
    };
    rpc: {
      public_servers_url: string[];
    };
    flags: {
      supports_trading: boolean;
      supports_sending: boolean;
      supports_bridge: boolean;
    };
  };
  relationships: {
    native_fungible: {
      links: ChainLinks;
      data: ChainData;
    };
    wrapped_native_fungible?: {
      links: ChainLinks;
      data: ChainData;
    };
  };
  links: ChainLinks;
}
export const ZERION_CHAINS: Chain[] = [
  {
    type: "chains",
    id: "arbitrum",
    attributes: {
      external_id: "0xa4b1",
      name: "Arbitrum",
      icon: {
        url: "/blockchains/logos/arbitrum.png",
      },
      explorer: {
        name: "Arbiscan",
        token_url_format: "https://arbiscan.io/token/{ADDRESS}",
        tx_url_format: "https://arbiscan.io/tx/{HASH}",
        home_url: "https://arbiscan.io",
      },
      rpc: {
        public_servers_url: ["https://arb1.arbitrum.io/rpc"],
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
        data: {
          type: "fungibles",
          id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/arbitrum",
    },
  },
  {
    type: "chains",
    id: "binance-smart-chain",
    attributes: {
      external_id: "0x38",
      name: "BSC",
      icon: {
        url: "/blockchains/logos/bsc.png",
      },
      explorer: {
        name: "BscScan",
        token_url_format: "https://bscscan.com/token/{ADDRESS}",
        tx_url_format: "https://bscscan.com/tx/{HASH}",
        home_url: "https://bscscan.com",
      },
      rpc: {
        public_servers_url: [
          "https://bsc-dataseed1.defibit.io",
          "https://bsc-dataseed2.defibit.io",
          "https://bsc-dataseed3.defibit.io",
          "https://bsc-dataseed4.defibit.io",
          "https://bsc-dataseed1.ninicoin.io",
          "https://bsc-dataseed2.ninicoin.io",
          "https://bsc-dataseed3.ninicoin.io",
          "https://bsc-dataseed4.ninicoin.io",
          "https://bsc-dataseed1.binance.org",
          "https://bsc-dataseed2.binance.org",
          "https://bsc-dataseed3.binance.org",
          "https://bsc-dataseed4.binance.org",
        ],
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0xb8c77482e45f1f44de1745f52c74426c631bdd52",
        },
        data: {
          type: "fungibles",
          id: "0xb8c77482e45f1f44de1745f52c74426c631bdd52",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
        },
        data: {
          type: "fungibles",
          id: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/binance-smart-chain",
    },
  },
  {
    type: "chains",
    id: "ethereum",
    attributes: {
      external_id: "0x1",
      name: "Ethereum",
      icon: {
        url: "/blockchains/logos/ethereum.png",
      },
      explorer: {
        name: "Etherscan",
        token_url_format: "https://etherscan.io/token/{ADDRESS}",
        tx_url_format: "https://etherscan.io/tx/{HASH}",
        home_url: "https://etherscan.io",
      },
      rpc: {
        public_servers_url: [
          "https://eth.llamarpc.com",
          "https://mainnet.gateway.tenderly.co",
        ],
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
        data: {
          type: "fungibles",
          id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/ethereum",
    },
  },
  {
    type: "chains",
    id: "blast",
    attributes: {
      external_id: "0x13e31",
      name: "Blast",
      icon: {
        url: "/blockchains/logos/81457.png",
      },
      explorer: {
        name: "Blastscan",
        token_url_format: "https://blastscan.io/token/{ADDRESS}",
        tx_url_format: "https://blastscan.io/tx/{HASH}",
        home_url: "https://blastscan.io",
      },
      rpc: {
        public_servers_url: ["https://rpc.blast.io/"],
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
        data: {
          type: "fungibles",
          id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/blast",
    },
  },
  {
    type: "chains",
    id: "ape",
    attributes: {
      external_id: "0x8173",
      name: "Ape Chain",
      icon: {
        url: "/blockchains/logos/apechain.png",
      },
      explorer: {
        name: "Apechain Explorer",
        token_url_format:
          "https://apechain.calderaexplorer.xyz/token/{ADDRESS}",
        tx_url_format: "https://apechain.calderaexplorer.xyz/tx/{HASH}",
        home_url: "https://apechain.calderaexplorer.xyz/",
      },
      rpc: {
        public_servers_url: ["https://rpc.zerion.io/v1/ape"],
      },
      flags: {
        supports_trading: false,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0x4d224452801aced8b2f0aebe155379bb5d594381",
        },
        data: {
          type: "fungibles",
          id: "0x4d224452801aced8b2f0aebe155379bb5d594381",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/ape",
    },
  },
  {
    type: "chains",
    id: "avalanche",
    attributes: {
      external_id: "0xa86a",
      name: "Avalanche",
      icon: {
        url: "/blockchains/logos/avalanche.png",
      },
      explorer: {
        name: "SnowScan",
        token_url_format: "https://snowscan.xyz/token/{ADDRESS}",
        tx_url_format: "https://snowscan.xyz/tx/{HASH}",
        home_url: "https://snowscan.xyz",
      },
      rpc: {
        public_servers_url: ["https://api.avax.network/ext/bc/C/rpc"],
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/43e05303-bf43-48df-be45-352d7567ff39",
        },
        data: {
          type: "fungibles",
          id: "43e05303-bf43-48df-be45-352d7567ff39",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
        },
        data: {
          type: "fungibles",
          id: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/avalanche",
    },
  },
  {
    type: "chains",
    id: "abstract",
    attributes: {
      external_id: "0xab5",
      name: "Abstract",
      icon: {
        url: "/blockchains/logos/abstract.png",
      },
      explorer: {
        name: "Abstract Explorer",
        token_url_format: "https://abscan.org/token/{ADDRESS}",
        tx_url_format: "https://abscan.org/tx/{HASH}",
        home_url: "https://abscan.org",
      },
      rpc: {
        public_servers_url: ["https://rpc.zerion.io/v1/abstract"],
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
        data: {
          type: "fungibles",
          id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/abstract",
    },
  },
  {
    type: "chains",
    id: "opbnb",
    attributes: {
      external_id: "0xcc",
      name: "opBNB",
      icon: {
        url: "/blockchains/logos/opBNB.png",
      },
      explorer: {
        name: "opBNB Block Explorer",
        token_url_format: "https://mainnet.opbnbscan.com/token/{ADDRESS}",
        tx_url_format: "https://mainnet.opbnbscan.com/tx/{HASH}",
        home_url: "https://mainnet.opbnbscan.com",
      },
      rpc: {
        public_servers_url: [
          "https://opbnb-mainnet-rpc.bnbchain.org",
          "https://opbnb-mainnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3",
          "wss://opbnb-mainnet.nodereal.io/ws/v1/64a9df0874fb4a93b9d0a3849de012d3",
          "https://opbnb-mainnet.nodereal.io/v1/e9a36765eb8a40b9bd12e680a1fd2bc5",
          "wss://opbnb-mainnet.nodereal.io/ws/v1/e9a36765eb8a40b9bd12e680a1fd2bc5",
          "https://opbnb-rpc.publicnode.com",
          "wss://opbnb-rpc.publicnode.com",
          "https://opbnb.drpc.org",
          "wss://opbnb.drpc.org",
        ],
      },
      flags: {
        supports_trading: false,
        supports_sending: true,
        supports_bridge: false,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0xb8c77482e45f1f44de1745f52c74426c631bdd52",
        },
        data: {
          type: "fungibles",
          id: "0xb8c77482e45f1f44de1745f52c74426c631bdd52",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/opbnb",
    },
  },
  {
    type: "chains",
    id: "berachain",
    attributes: {
      external_id: "0x138de",
      name: "Berachain",
      icon: {
        url: "/blockchains/logos/berra.png",
      },
      explorer: {
        name: "Berachain Explorer",
        token_url_format: "https://berascan.com/token/{ADDRESS}",
        tx_url_format: "https://berascan.com/tx/{HASH}",
        home_url: "https://berascan.com",
      },
      rpc: {
        public_servers_url: ["https://rpc.zerion.io/v1/berachain"],
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/7795d362-16cd-4418-b715-03e99e360823",
        },
        data: {
          type: "fungibles",
          id: "7795d362-16cd-4418-b715-03e99e360823",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/6a42d07c-fe9a-42bc-813e-2db0c5a747a1",
        },
        data: {
          type: "fungibles",
          id: "6a42d07c-fe9a-42bc-813e-2db0c5a747a1",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/berachain",
    },
  },
  {
    type: "chains",
    id: "zksync-era",
    attributes: {
      external_id: "0x144",
      name: "ZKsync Era",
      icon: {
        url: "/blockchains/logos/324.png",
      },
      explorer: {
        name: "ZKsync Era Block Explorer",
        token_url_format: "https://era.zksync.network/address/{ADDRESS}",
        tx_url_format: "https://era.zksync.network/tx/{HASH}",
        home_url: "https://era.zksync.network",
      },
      rpc: {
        public_servers_url: ["https://mainnet.era.zksync.io"],
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
        data: {
          type: "fungibles",
          id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/zksync-era",
    },
  },
  {
    type: "chains",
    id: "bob",
    attributes: {
      external_id: "0xed88",
      name: "BOB",
      icon: {
        url: "/blockchains/logos/bob.png",
      },
      explorer: {
        name: "bobscout",
        token_url_format: "https://explorer.gobob.xyz/token/{ADDRESS}",
        tx_url_format: "https://explorer.gobob.xyz/tx/{HASH}",
        home_url: "https://explorer.gobob.xyz",
      },
      rpc: {
        public_servers_url: ["https://rpc.gobob.xyz", "wss://rpc.gobob.xyz"],
      },
      flags: {
        supports_trading: false,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/bob",
    },
  },
  {
    type: "chains",
    id: "cyber",
    attributes: {
      external_id: "0x1d88",
      name: "Cyber",
      icon: {
        url: "/blockchains/logos/cyber.png",
      },
      explorer: {
        name: "Cyber Explorer",
        token_url_format: "https://cyberscan.co/token/{ADDRESS}",
        tx_url_format: "https://cyberscan.co/tx/{HASH}",
        home_url: "https://cyberscan.co",
      },
      rpc: {
        public_servers_url: [
          "https://cyber.alt.technology/",
          "wss://cyber-ws.alt.technology/",
          "https://rpc.cyber.co/",
          "wss://rpc.cyber.co/",
        ],
      },
      flags: {
        supports_trading: false,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/cyber",
    },
  },
  {
    type: "chains",
    id: "degen",
    attributes: {
      external_id: "0x27bc86aa",
      name: "Degen Chain",
      icon: {
        url: "/blockchains/logos/666666666.png",
      },
      explorer: {
        name: "Degen Explorer",
        token_url_format: "https://explorer.degen.tips/token/{ADDRESS}",
        tx_url_format: "https://explorer.degen.tips/tx/{HASH}",
        home_url: "https://explorer.degen.tips",
      },
      rpc: {
        public_servers_url: ["https://rpc.degen.tips"],
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/d590ac9c-6971-42db-b900-0bd057033ae0",
        },
        data: {
          type: "fungibles",
          id: "d590ac9c-6971-42db-b900-0bd057033ae0",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/06d135ee-95f3-489d-a0a3-70129d9f952c",
        },
        data: {
          type: "fungibles",
          id: "06d135ee-95f3-489d-a0a3-70129d9f952c",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/degen",
    },
  },
  {
    type: "chains",
    id: "fraxtal",
    attributes: {
      external_id: "0xfc",
      name: "Fraxtal",
      icon: {
        url: "/blockchains/logos/fraxtal.png",
      },
      explorer: {
        name: "Fraxscan",
        token_url_format: "https://fraxscan.com/token/{ADDRESS}",
        tx_url_format: "https://fraxscan.com/tx/{HASH}",
        home_url: "https://fraxscan.com",
      },
      rpc: {
        public_servers_url: ["https://rpc.frax.com"],
      },
      flags: {
        supports_trading: false,
        supports_sending: true,
        supports_bridge: false,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/50e9e0d9-d591-4083-977a-48921057b02d",
        },
        data: {
          type: "fungibles",
          id: "50e9e0d9-d591-4083-977a-48921057b02d",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/fraxtal",
    },
  },
  {
    type: "chains",
    id: "gravity-alpha",
    attributes: {
      external_id: "0x659",
      name: "Gravity Alpha",
      icon: {
        url: "/blockchains/logos/gravity.png",
      },
      explorer: {
        name: "Gravity Alpha Mainnet Explorer",
        token_url_format: "https://explorer.gravity.xyz/token/{ADDRESS}",
        tx_url_format: "https://explorer.gravity.xyz/tx/{HASH}",
        home_url: "https://explorer.gravity.xyz",
      },
      rpc: {
        public_servers_url: ["https://rpc.gravity.xyz"],
      },
      flags: {
        supports_trading: false,
        supports_sending: true,
        supports_bridge: false,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/21d6737a-ebfe-44f2-99b7-78e8282dc9ef",
        },
        data: {
          type: "fungibles",
          id: "21d6737a-ebfe-44f2-99b7-78e8282dc9ef",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/071102b7-cab5-4e48-836d-9b2375b91794",
        },
        data: {
          type: "fungibles",
          id: "071102b7-cab5-4e48-836d-9b2375b91794",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/gravity-alpha",
    },
  },
  {
    type: "chains",
    id: "hyperevm",
    attributes: {
      external_id: "0x3e7",
      name: "HyperEVM",
      icon: {
        url: "/blockchains/logos/999.png",
      },
      explorer: {
        name: "Purrsec",
        token_url_format: "https://purrsec.com/address/{ADDRESS}",
        tx_url_format: "https://purrsec.com/tx/{HASH}",
        home_url: "https://purrsec.com",
      },
      rpc: {
        public_servers_url: [
          "https://rpc.hyperliquid.xyz/evm",
          "https://rpc.hypurrscan.io",
          "https://rpc.hyperlend.finance",
          "https://hyperliquid-json-rpc.stakely.io",
          "https://hyperliquid.drpc.org",
        ],
      },
      flags: {
        supports_trading: false,
        supports_sending: true,
        supports_bridge: false,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0bcc84bb-c150-4178-acaf-8e6ad58540b5",
        },
        data: {
          type: "fungibles",
          id: "0bcc84bb-c150-4178-acaf-8e6ad58540b5",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/5a19418e-4964-4ab8-8657-3f98dabe1cc2",
        },
        data: {
          type: "fungibles",
          id: "5a19418e-4964-4ab8-8657-3f98dabe1cc2",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/hyperevm",
    },
  },
  {
    type: "chains",
    id: "ink",
    attributes: {
      external_id: "0xdef1",
      name: "Ink",
      icon: {
        url: "/blockchains/logos/ink.png",
      },
      explorer: {
        name: "Ink Explorer",
        token_url_format: "https://explorer.inkonchain.com/token/{ADDRESS}",
        tx_url_format: "https://explorer.inkonchain.com/tx/{HASH}",
        home_url: "https://explorer.inkonchain.com",
      },
      rpc: {
        public_servers_url: ["https://rpc-qnd.inkonchain.com"],
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
        data: {
          type: "fungibles",
          id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/ink",
    },
  },
  {
    type: "chains",
    id: "lens",
    attributes: {
      external_id: "0xe8",
      name: "Lens",
      icon: {
        url: "/blockchains/logos/lens.png",
      },
      explorer: {
        name: "Lens Explorer",
        token_url_format: "https://explorer.lens.xyz/token/{ADDRESS}",
        tx_url_format: "https://explorer.lens.xyz/tx/{HASH}",
        home_url: "https://explorer.lens.xyz",
      },
      rpc: {
        public_servers_url: ["https://rpc.zerion.io/v1/lens"],
      },
      flags: {
        supports_trading: false,
        supports_sending: true,
        supports_bridge: false,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0x40d16fc0246ad3160ccc09b8d0d3a2cd28ae6c2f",
        },
        data: {
          type: "fungibles",
          id: "0x40d16fc0246ad3160ccc09b8d0d3a2cd28ae6c2f",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/1e6d7e24-70a8-4b3c-8150-8baf83b8cbad",
        },
        data: {
          type: "fungibles",
          id: "1e6d7e24-70a8-4b3c-8150-8baf83b8cbad",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/lens",
    },
  },
  {
    type: "chains",
    id: "lisk",
    attributes: {
      external_id: "0x46f",
      name: "Lisk",
      icon: {
        url: "/blockchains/logos/lisk.png",
      },
      explorer: {
        name: "Lisk",
        token_url_format: "https://blockscout.lisk.com//token/{ADDRESS}",
        tx_url_format: "https://blockscout.lisk.com//tx/{HASH}",
        home_url: "https://blockscout.lisk.com/",
      },
      rpc: {
        public_servers_url: ["https://rpc.api.lisk.com"],
      },
      flags: {
        supports_trading: false,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/lisk",
    },
  },
  {
    type: "chains",
    id: "mode",
    attributes: {
      external_id: "0x868b",
      name: "Mode",
      icon: {
        url: "/blockchains/logos/mode.png",
      },
      explorer: {
        name: "Blockscout",
        token_url_format: "https://explorer.mode.network/token/{ADDRESS}",
        tx_url_format: "https://explorer.mode.network/tx/{HASH}",
        home_url: "https://explorer.mode.network",
      },
      rpc: {
        public_servers_url: [
          "https://mainnet.mode.network",
          "https://mode.drpc.org",
          "wss://mode.drpc.org",
        ],
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/mode",
    },
  },
  {
    type: "chains",
    id: "base",
    attributes: {
      external_id: "0x2105",
      name: "Base",
      icon: {
        url: "/blockchains/logos/8453.png",
      },
      explorer: {
        name: "Base Explorer",
        token_url_format: "https://basescan.org/token/{ADDRESS}",
        tx_url_format: "https://basescan.org/tx/{HASH}",
        home_url: "https://basescan.org",
      },
      rpc: {
        public_servers_url: ["https://mainnet.base.org"],
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
        data: {
          type: "fungibles",
          id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/base",
    },
  },
  {
    type: "chains",
    id: "mantle",
    attributes: {
      external_id: "0x1388",
      name: "Mantle",
      icon: {
        url: "/blockchains/logos/mantle.png",
      },
      explorer: {
        name: "Mantle Explorer",
        token_url_format: "https://explorer.mantle.xyz/token/{ADDRESS}",
        tx_url_format: "https://explorer.mantle.xyz/tx/{HASH}",
        home_url: "https://explorer.mantle.xyz",
      },
      rpc: {
        public_servers_url: [
          "https://rpc.mantle.xyz",
          "https://mantle-rpc.publicnode.com",
          "wss://mantle-rpc.publicnode.com",
        ],
      },
      flags: {
        supports_trading: false,
        supports_sending: true,
        supports_bridge: false,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/f8e50e85-dc0b-4820-a1d8-1f98db6e60f8",
        },
        data: {
          type: "fungibles",
          id: "f8e50e85-dc0b-4820-a1d8-1f98db6e60f8",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/c16bf402-94a8-4d40-9c26-f8b4336b7f17",
        },
        data: {
          type: "fungibles",
          id: "c16bf402-94a8-4d40-9c26-f8b4336b7f17",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/mantle",
    },
  },
  {
    type: "chains",
    id: "optimism",
    attributes: {
      external_id: "0xa",
      name: "Optimism",
      icon: {
        url: "/blockchains/logos/optimism.png",
      },
      explorer: {
        name: "Etherscan",
        token_url_format: "https://optimistic.etherscan.io/token/{ADDRESS}",
        tx_url_format: "https://optimistic.etherscan.io/tx/{HASH}",
        home_url: "https://optimistic.etherscan.io",
      },
      rpc: {
        public_servers_url: ["https://mainnet.optimism.io"],
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
        data: {
          type: "fungibles",
          id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/optimism",
    },
  },
  {
    type: "chains",
    id: "polygon",
    attributes: {
      external_id: "0x89",
      name: "Polygon",
      icon: {
        url: "/blockchains/logos/polygon.png",
      },
      explorer: {
        name: "PolygonScan",
        token_url_format: "https://polygonscan.com/token/{ADDRESS}",
        tx_url_format: "https://polygonscan.com/tx/{HASH}",
        home_url: "https://polygonscan.com",
      },
      rpc: {
        public_servers_url: [
          "https://polygon-rpc.com",
          "https://rpc-mainnet.matic.network",
          "https://matic-mainnet.chainstacklabs.com",
          "https://rpc-mainnet.maticvigil.com",
          "https://rpc-mainnet.matic.quiknode.pro",
          "https://matic-mainnet-full-rpc.bwarelabs.com",
        ],
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/7560001f-9b6d-4115-b14a-6c44c4334ef2",
        },
        data: {
          type: "fungibles",
          id: "7560001f-9b6d-4115-b14a-6c44c4334ef2",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/ef4dfcc9-4a7e-4a92-a538-df3d6f53e517",
        },
        data: {
          type: "fungibles",
          id: "ef4dfcc9-4a7e-4a92-a538-df3d6f53e517",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/polygon",
    },
  },
  {
    type: "chains",
    id: "celo",
    attributes: {
      external_id: "0xa4ec",
      name: "Celo",
      icon: {
        url: "/blockchains/logos/42220.png",
      },
      explorer: {
        name: "Celoscan",
        token_url_format: "https://celoscan.io/token/{ADDRESS}",
        tx_url_format: "https://celoscan.io/tx/{HASH}",
        home_url: "https://celoscan.io",
      },
      rpc: {
        public_servers_url: [
          "https://forno.celo.org",
          "wss://forno.celo.org/ws",
        ],
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0x471ece3750da237f93b8e339c536989b8978a438",
        },
        data: {
          type: "fungibles",
          id: "0x471ece3750da237f93b8e339c536989b8978a438",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/celo",
    },
  },
  {
    type: "chains",
    id: "manta-pacific",
    attributes: {
      external_id: "0xa9",
      name: "Manta Pacific",
      icon: {
        url: "/blockchains/logos/manta.png",
      },
      explorer: {
        name: "manta-pacific Explorer",
        token_url_format:
          "https://pacific-explorer.manta.network/token/{ADDRESS}",
        tx_url_format: "https://pacific-explorer.manta.network/tx/{HASH}",
        home_url: "https://pacific-explorer.manta.network",
      },
      rpc: {
        public_servers_url: [
          "https://pacific-rpc.manta.network/http",
          "https://manta-pacific.drpc.org",
          "wss://manta-pacific.drpc.org",
        ],
      },
      flags: {
        supports_trading: false,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/manta-pacific",
    },
  },
  {
    type: "chains",
    id: "xdai",
    attributes: {
      external_id: "0x64",
      name: "Gnosis Chain",
      icon: {
        url: "/blockchains/logos/xdai.png",
      },
      explorer: {
        name: "GnosisScan",
        token_url_format: "https://gnosisscan.io/token/{ADDRESS}",
        tx_url_format: "https://gnosisscan.io/tx/{HASH}",
        home_url: "https://gnosisscan.io",
      },
      rpc: {
        public_servers_url: [
          "https://gnosis-mainnet.public.blastapi.io",
          "https://gnosischain-rpc.gateway.pokt.network",
          "https://rpc.ankr.com/gnosis",
          "https://rpc.gnosischain.com",
        ],
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/b99ea659-0ab1-4832-bf44-3bf1cc1acac7",
        },
        data: {
          type: "fungibles",
          id: "b99ea659-0ab1-4832-bf44-3bf1cc1acac7",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0xe91d153e0b41518a2ce8dd3d7944fa863463a97d",
        },
        data: {
          type: "fungibles",
          id: "0xe91d153e0b41518a2ce8dd3d7944fa863463a97d",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/xdai",
    },
  },
  {
    type: "chains",
    id: "fantom",
    attributes: {
      external_id: "0xfa",
      name: "Fantom",
      icon: {
        url: "/blockchains/logos/fantom.png",
      },
      explorer: {
        name: "FtmScan",
        token_url_format: "https://ftmscan.com/token/{ADDRESS}",
        tx_url_format: "https://ftmscan.com/tx/{HASH}",
        home_url: "https://ftmscan.com",
      },
      rpc: {
        public_servers_url: ["https://rpc.ftm.tools"],
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: false,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0x4e15361fd6b4bb609fa63c81a2be19d873717870",
        },
        data: {
          type: "fungibles",
          id: "0x4e15361fd6b4bb609fa63c81a2be19d873717870",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
        },
        data: {
          type: "fungibles",
          id: "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/fantom",
    },
  },
  {
    type: "chains",
    id: "ronin",
    attributes: {
      external_id: "0x7e4",
      name: "Ronin",
      icon: {
        url: "/blockchains/logos/2020.png",
      },
      explorer: {
        name: "Ronin Block Explorer",
        token_url_format: "https://app.roninchain.com/token/{ADDRESS}",
        tx_url_format: "https://app.roninchain.com/tx/{HASH}",
        home_url: "https://app.roninchain.com",
      },
      rpc: {
        public_servers_url: ["https://api.roninchain.com/rpc"],
      },
      flags: {
        supports_trading: false,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/3e1f750c-aff1-4918-8a18-4e71f28ffa47",
        },
        data: {
          type: "fungibles",
          id: "3e1f750c-aff1-4918-8a18-4e71f28ffa47",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/6dd2b90b-c236-498d-b2f4-f1098c56ddeb",
        },
        data: {
          type: "fungibles",
          id: "6dd2b90b-c236-498d-b2f4-f1098c56ddeb",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/ronin",
    },
  },
  {
    type: "chains",
    id: "linea",
    attributes: {
      external_id: "0xe708",
      name: "Linea",
      icon: {
        url: "/blockchains/logos/59144.png",
      },
      explorer: {
        name: "Etherscan",
        token_url_format: "https://lineascan.build/token/{ADDRESS}",
        tx_url_format: "https://lineascan.build/tx/{HASH}",
        home_url: "https://lineascan.build",
      },
      rpc: {
        public_servers_url: [
          "https://rpc.linea.build",
          "wss://rpc.linea.build",
        ],
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
        data: {
          type: "fungibles",
          id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/linea",
    },
  },
  {
    type: "chains",
    id: "metis-andromeda",
    attributes: {
      external_id: "0x440",
      name: "Metis Andromeda",
      icon: {
        url: "/blockchains/logos/metis.png",
      },
      explorer: {
        name: "blockscout",
        token_url_format: "https://andromeda-explorer.metis.io/token/{ADDRESS}",
        tx_url_format: "https://andromeda-explorer.metis.io/tx/{HASH}",
        home_url: "https://andromeda-explorer.metis.io",
      },
      rpc: {
        public_servers_url: [
          "https://andromeda.metis.io/?owner=1088",
          "https://metis.drpc.org",
          "wss://metis.drpc.org",
        ],
      },
      flags: {
        supports_trading: false,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0x9e32b13ce7f2e80a01932b42553652e053d6ed8e",
        },
        data: {
          type: "fungibles",
          id: "0x9e32b13ce7f2e80a01932b42553652e053d6ed8e",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/metis-andromeda",
    },
  },
  {
    type: "chains",
    id: "aurora",
    attributes: {
      external_id: "0x4e454152",
      name: "Aurora",
      icon: {
        url: "/blockchains/logos/aurora.png",
      },
      explorer: {
        name: "Aurora Explorer",
        token_url_format: "https://explorer.aurora.dev/token/{ADDRESS}",
        tx_url_format: "https://explorer.aurora.dev/tx/{HASH}",
        home_url: "https://explorer.aurora.dev",
      },
      rpc: {
        public_servers_url: ["https://mainnet.aurora.dev"],
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
        data: {
          type: "fungibles",
          id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/aurora",
    },
  },
  {
    type: "chains",
    id: "xinfin-xdc",
    attributes: {
      external_id: "0x32",
      name: "XDC",
      icon: {
        url: "/blockchains/logos/xdc.png",
      },
      explorer: {
        name: "xdcscan",
        token_url_format: "https://xdcscan.com/token/{ADDRESS}",
        tx_url_format: "https://xdcscan.com/tx/{HASH}",
        home_url: "https://xdcscan.com",
      },
      rpc: {
        public_servers_url: [
          "https://rpc.xdcrpc.com",
          "https://rpc1.xinfin.network",
          "https://erpc.xinfin.network",
          "https://erpc.xdcrpc.com",
          "https://rpc.xdc.org",
          "https://earpc.xinfin.network",
          "https://rpc.ankr.com/xdc",
          "https://rpc.xinfin.network",
          "https://xdc-mainnet.gateway.tatum.io",
        ],
      },
      flags: {
        supports_trading: false,
        supports_sending: true,
        supports_bridge: false,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/49d48cd0-5c09-4b3f-9695-d6f9ccc23c39",
        },
        data: {
          type: "fungibles",
          id: "49d48cd0-5c09-4b3f-9695-d6f9ccc23c39",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/9d79c1cb-1b36-420c-b0c9-3cae1b1b4298",
        },
        data: {
          type: "fungibles",
          id: "9d79c1cb-1b36-420c-b0c9-3cae1b1b4298",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/xinfin-xdc",
    },
  },
  {
    type: "chains",
    id: "cronos-zkevm",
    attributes: {
      external_id: "0x184",
      name: "Cronos zkEVM",
      icon: {
        url: "/blockchains/logos/icons/cronos-zkevm.png",
      },
      explorer: {
        name: "Cronos zkEVM",
        token_url_format: "https://explorer.zkevm.cronos.org//token/{ADDRESS}",
        tx_url_format: "https://explorer.zkevm.cronos.org//tx/{HASH}",
        home_url: "https://explorer.zkevm.cronos.org/",
      },
      rpc: {
        public_servers_url: ["https://mainnet.zkevm.cronos.org"],
      },
      flags: {
        supports_trading: false,
        supports_sending: true,
        supports_bridge: false,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/56f2a7d9-87e1-47da-90ab-ea0b5ae004c3",
        },
        data: {
          type: "fungibles",
          id: "56f2a7d9-87e1-47da-90ab-ea0b5ae004c3",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/cronos-zkevm",
    },
  },
  {
    type: "chains",
    id: "polygon-zkevm",
    attributes: {
      external_id: "0x44d",
      name: "Polygon zkEVM",
      icon: {
        url: "/blockchains/logos/1101.png",
      },
      explorer: {
        name: "blockscout",
        token_url_format: "https://zkevm.polygonscan.com/token/{ADDRESS}",
        tx_url_format: "https://zkevm.polygonscan.com/tx/{HASH}",
        home_url: "https://zkevm.polygonscan.com",
      },
      rpc: {
        public_servers_url: ["https://zkevm-rpc.com"],
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
        data: {
          type: "fungibles",
          id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/polygon-zkevm",
    },
  },
  {
    type: "chains",
    id: "polynomial",
    attributes: {
      external_id: "0x1f48",
      name: "Polynomial",
      icon: {
        url: "/blockchains/logos/polynomial.png",
      },
      explorer: {
        name: "PolynomialExplorer",
        token_url_format: "https://polynomialscan.io//token/{ADDRESS}",
        tx_url_format: "https://polynomialscan.io//tx/{HASH}",
        home_url: "https://polynomialscan.io/",
      },
      rpc: {
        public_servers_url: ["https://rpc.polynomial.fi"],
      },
      flags: {
        supports_trading: false,
        supports_sending: true,
        supports_bridge: false,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/polynomial",
    },
  },
  {
    type: "chains",
    id: "rari",
    attributes: {
      external_id: "0x52415249",
      name: "Rari",
      icon: {
        url: "/blockchains/logos/1380012617.png",
      },
      explorer: {
        name: "rarichain-explorer",
        token_url_format:
          "https://mainnet.explorer.rarichain.org/token/{ADDRESS}",
        tx_url_format: "https://mainnet.explorer.rarichain.org/tx/{HASH}",
        home_url: "https://mainnet.explorer.rarichain.org",
      },
      rpc: {
        public_servers_url: ["https://rari.calderachain.xyz/http"],
      },
      flags: {
        supports_trading: false,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/rari",
    },
  },
  {
    type: "chains",
    id: "redstone",
    attributes: {
      external_id: "0x2b2",
      name: "Redstone",
      icon: {
        url: "/blockchains/logos/redstone.png",
      },
      explorer: {
        name: "blockscout",
        token_url_format: "https://explorer.redstone.xyz/token/{ADDRESS}",
        tx_url_format: "https://explorer.redstone.xyz/tx/{HASH}",
        home_url: "https://explorer.redstone.xyz",
      },
      rpc: {
        public_servers_url: [
          "https://rpc.redstonechain.com",
          "wss://rpc.redstonechain.com",
        ],
      },
      flags: {
        supports_trading: false,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/redstone",
    },
  },
  {
    type: "chains",
    id: "scroll",
    attributes: {
      external_id: "0x82750",
      name: "Scroll",
      icon: {
        url: "/blockchains/logos/scroll.png",
      },
      explorer: {
        name: "Scrollscan",
        token_url_format: "https://scrollscan.com/token/{ADDRESS}",
        tx_url_format: "https://scrollscan.com/tx/{HASH}",
        home_url: "https://scrollscan.com",
      },
      rpc: {
        public_servers_url: [
          "https://rpc.scroll.io",
          "https://rpc-scroll.icecreamswap.com",
          "https://rpc.ankr.com/scroll",
          "https://scroll-mainnet.chainstacklabs.com",
        ],
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
        data: {
          type: "fungibles",
          id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/scroll",
    },
  },
  {
    type: "chains",
    id: "sei",
    attributes: {
      external_id: "0x531",
      name: "Sei",
      icon: {
        url: "/blockchains/logos/icons/sei.png",
      },
      explorer: {
        name: "Sei Explorer",
        token_url_format: "https://seistream.app/token/{ADDRESS}",
        tx_url_format: "https://seistream.app/tx/{HASH}",
        home_url: "https://seistream.app",
      },
      rpc: {
        public_servers_url: ["https://evm-rpc.sei-apis.com"],
      },
      flags: {
        supports_trading: false,
        supports_sending: true,
        supports_bridge: false,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/d1706cbf-d14c-4065-8f8e-cf428dd5bd98",
        },
        data: {
          type: "fungibles",
          id: "d1706cbf-d14c-4065-8f8e-cf428dd5bd98",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/sei",
    },
  },
  {
    type: "chains",
    id: "solana",
    attributes: {
      external_id: "0x65",
      name: "Solana",
      icon: {
        url: "/blockchains/logos/solana.png",
      },
      explorer: {
        name: "Solscan",
        token_url_format: "https://solscan.io/token/{ADDRESS}",
        tx_url_format: "https://solscan.io/tx/{HASH}",
        home_url: "https://solscan.io",
      },
      rpc: {
        public_servers_url: ["https://free.rpcpool.com"],
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/11111111111111111111111111111111",
        },
        data: {
          type: "fungibles",
          id: "11111111111111111111111111111111",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/c8463d41-40c8-4495-9965-af59d52ff042",
        },
        data: {
          type: "fungibles",
          id: "c8463d41-40c8-4495-9965-af59d52ff042",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/solana",
    },
  },
  {
    type: "chains",
    id: "soneium",
    attributes: {
      external_id: "0x74c",
      name: "Soneium",
      icon: {
        url: "/blockchains/logos/soneium.png",
      },
      explorer: {
        name: "Soneium Explorer",
        token_url_format: "https://soneium.blockscout.com/token/{ADDRESS}",
        tx_url_format: "https://soneium.blockscout.com/tx/{HASH}",
        home_url: "https://soneium.blockscout.com",
      },
      rpc: {
        public_servers_url: ["https://rpc.zerion.io/v1/soneium"],
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
        data: {
          type: "fungibles",
          id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/soneium",
    },
  },
  {
    type: "chains",
    id: "sonic",
    attributes: {
      external_id: "0x92",
      name: "Sonic",
      icon: {
        url: "/blockchains/logos/sonic_s.png",
      },
      explorer: {
        name: "Sonic Explorer",
        token_url_format: "https://sonicscan.org/token/{ADDRESS}",
        tx_url_format: "https://sonicscan.org/tx/{HASH}",
        home_url: "https://sonicscan.org",
      },
      rpc: {
        public_servers_url: ["https://rpc.soniclabs.com"],
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/ee334614-0375-469e-b699-e2df1bf4185d",
        },
        data: {
          type: "fungibles",
          id: "ee334614-0375-469e-b699-e2df1bf4185d",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/d22aba16-16b9-4f1d-943b-955e7a8f92cd",
        },
        data: {
          type: "fungibles",
          id: "d22aba16-16b9-4f1d-943b-955e7a8f92cd",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/sonic",
    },
  },
  {
    type: "chains",
    id: "swellchain",
    attributes: {
      external_id: "0x783",
      name: "Swellchain",
      icon: {
        url: "/blockchains/logos/swellchain.png",
      },
      explorer: {
        name: "Swell Explorer",
        token_url_format: "https://explorer.swellnetwork.io//token/{ADDRESS}",
        tx_url_format: "https://explorer.swellnetwork.io//tx/{HASH}",
        home_url: "https://explorer.swellnetwork.io/",
      },
      rpc: {
        public_servers_url: [
          "https://swell-mainnet.alt.technology",
          "https://rpc.ankr.com/swell",
        ],
      },
      flags: {
        supports_trading: false,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/swellchain",
    },
  },
  {
    type: "chains",
    id: "taiko",
    attributes: {
      external_id: "0x28c58",
      name: "Taiko",
      icon: {
        url: "/blockchains/logos/taiko.png",
      },
      explorer: {
        name: "Taiko Explorer",
        token_url_format: "https://taikoscan.io/token/{ADDRESS}",
        tx_url_format: "https://taikoscan.io/tx/{HASH}",
        home_url: "https://taikoscan.io/",
      },
      rpc: {
        public_servers_url: ["https://rpc.taiko.xyz", "wss://ws.taiko.xyz"],
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
        data: {
          type: "fungibles",
          id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/taiko",
    },
  },
  {
    type: "chains",
    id: "tomochain",
    attributes: {
      external_id: "0x58",
      name: "Viction",
      icon: {
        url: "/blockchains/logos/viction.png",
      },
      explorer: {
        name: "Vicscan",
        token_url_format: "https://www.vicscan.xyz//token/{ADDRESS}",
        tx_url_format: "https://www.vicscan.xyz//tx/{HASH}",
        home_url: "https://www.vicscan.xyz/",
      },
      rpc: {
        public_servers_url: ["https://rpc.viction.xyz"],
      },
      flags: {
        supports_trading: false,
        supports_sending: true,
        supports_bridge: false,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/2912694c-c696-4549-acfb-f43a87938623",
        },
        data: {
          type: "fungibles",
          id: "2912694c-c696-4549-acfb-f43a87938623",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/tomochain",
    },
  },
  {
    type: "chains",
    id: "unichain",
    attributes: {
      external_id: "0x82",
      name: "Unichain",
      icon: {
        url: "/blockchains/logos/unichain.png",
      },
      explorer: {
        name: "Unichain Explorer",
        token_url_format: "https://unichain.blockscout.com/token/{ADDRESS}",
        tx_url_format: "https://unichain.blockscout.com/tx/{HASH}",
        home_url: "https://unichain.blockscout.com",
      },
      rpc: {
        public_servers_url: ["https://rpc.zerion.io/v1/unichain"],
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
        data: {
          type: "fungibles",
          id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/unichain",
    },
  },
  {
    type: "chains",
    id: "wonder",
    attributes: {
      external_id: "0x25a5",
      name: "Wonder",
      icon: {
        url: "/blockchains/logos/9637.png",
      },
      explorer: {
        name: "Wonder Block Explorer",
        token_url_format:
          "https://explorer.mainnet.wonderchain.org/address/{ADDRESS}",
        tx_url_format: "https://explorer.mainnet.wonderchain.org/tx/{HASH}",
        home_url: "https://explorer.mainnet.wonderchain.org",
      },
      rpc: {
        public_servers_url: ["https://rpc.mainnet.wonderchain.org"],
      },
      flags: {
        supports_trading: false,
        supports_sending: true,
        supports_bridge: false,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
        data: {
          type: "fungibles",
          id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/wonder",
    },
  },
  {
    type: "chains",
    id: "okbchain",
    attributes: {
      external_id: "0xc4",
      name: "X Layer",
      icon: {
        url: "/blockchains/logos/okx.png",
      },
      explorer: {
        name: "OKLink",
        token_url_format: "https://www.oklink.com/xlayer/token/{ADDRESS}",
        tx_url_format: "https://www.oklink.com/xlayer/tx/{HASH}",
        home_url: "https://www.oklink.com/xlayer",
      },
      rpc: {
        public_servers_url: [
          "https://rpc.xlayer.tech",
          "https://xlayerrpc.okx.com",
        ],
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: false,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0x75231f58b43240c9718dd58b4967c5114342a86c",
        },
        data: {
          type: "fungibles",
          id: "0x75231f58b43240c9718dd58b4967c5114342a86c",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/8ecdd365-3776-4ec2-803b-194862b161ba",
        },
        data: {
          type: "fungibles",
          id: "8ecdd365-3776-4ec2-803b-194862b161ba",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/okbchain",
    },
  },
  {
    type: "chains",
    id: "world",
    attributes: {
      external_id: "0x1e0",
      name: "World Chain",
      icon: {
        url: "/blockchains/logos/worldchain.png",
      },
      explorer: {
        name: "WorldScan",
        token_url_format: "https://worldscan.org/token/{ADDRESS}",
        tx_url_format: "https://worldscan.org/tx/{HASH}",
        home_url: "https://worldscan.org",
      },
      rpc: {
        public_servers_url: ["https://worldchain-mainnet.g.alchemy.com/public"],
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
        data: {
          type: "fungibles",
          id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/world",
    },
  },
  {
    type: "chains",
    id: "zero",
    attributes: {
      external_id: "0x849ea",
      name: "ZERϴ",
      icon: {
        url: "/blockchains/logos/543210.png",
      },
      explorer: {
        name: "ZERϴ Explorer",
        token_url_format: "https://explorer.zero.network/token/{ADDRESS}",
        tx_url_format: "https://explorer.zero.network/tx/{HASH}",
        home_url: "https://explorer.zero.network",
      },
      rpc: {
        public_servers_url: ["https://rpc.zerion.io/v1/zero"],
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
        data: {
          type: "fungibles",
          id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/zero",
    },
  },
  {
    type: "chains",
    id: "zkcandy",
    attributes: {
      external_id: "0x140",
      name: "ZKcandy",
      icon: {
        url: "/blockchains/logos/zkcandy.png",
      },
      explorer: {
        name: "ZKcandy Block Explorer",
        token_url_format: "https://explorer.zkcandy.io/token/{ADDRESS}",
        tx_url_format: "https://explorer.zkcandy.io/tx/{HASH}",
        home_url: "https://explorer.zkcandy.io",
      },
      rpc: {
        public_servers_url: ["https://rpc.zkcandy.io"],
      },
      flags: {
        supports_trading: false,
        supports_sending: true,
        supports_bridge: false,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
        data: {
          type: "fungibles",
          id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/zkcandy",
    },
  },
  {
    type: "chains",
    id: "zklink-nova",
    attributes: {
      external_id: "0xc5cc4",
      name: "ZkLink Nova",
      icon: {
        url: "/blockchains/logos/zklink.png",
      },
      explorer: {
        name: "zkLink Nova Block Explorer",
        token_url_format: "https://explorer.zklink.io/token/{ADDRESS}",
        tx_url_format: "https://explorer.zklink.io/tx/{HASH}",
        home_url: "https://explorer.zklink.io",
      },
      rpc: {
        public_servers_url: ["https://rpc.zklink.io", "wss://rpc.zklink.io"],
      },
      flags: {
        supports_trading: false,
        supports_sending: true,
        supports_bridge: false,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/zklink-nova",
    },
  },
  {
    type: "chains",
    id: "katana",
    attributes: {
      external_id: "0xb67d2",
      name: "katana",
      icon: {
        url: "/blockchains/logos/katana.png",
      },
      explorer: {
        name: "katana explorer",
        token_url_format: "https://explorer.katanarpc.com/token/{ADDRESS}",
        tx_url_format: "https://explorer.katanarpc.com/tx/{HASH}",
        home_url: "https://explorer.katanarpc.com",
      },
      rpc: {
        public_servers_url: [
          "https://rpc.katanarpc.com",
          "https://rpc.katana.network",
        ],
      },
      flags: {
        supports_trading: false,
        supports_sending: true,
        supports_bridge: false,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
        data: {
          type: "fungibles",
          id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/katana",
    },
  },
  {
    type: "chains",
    id: "zora",
    attributes: {
      external_id: "0x76adf1",
      name: "Zora",
      icon: {
        url: "/blockchains/logos/zora.png",
      },
      explorer: {
        name: "Zora Network Explorer",
        token_url_format: "https://explorer.zora.energy/token/{ADDRESS}",
        tx_url_format: "https://explorer.zora.energy/tx/{HASH}",
        home_url: "https://explorer.zora.energy",
      },
      rpc: {
        public_servers_url: ["https://rpc.zora.energy/"],
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: {
          type: "fungibles",
          id: "eth",
        },
      },
      wrapped_native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
        data: {
          type: "fungibles",
          id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/zora",
    },
  },
  {
    type: "chains",
    id: "re-al",
    attributes: {
      external_id: "0x1b254",
      name: "re.al",
      icon: {
        url: "/blockchains/logos/real.png",
      },
      explorer: {
        name: "blockscout",
        token_url_format: "https://explorer.re.al/token/{ADDRESS}",
        tx_url_format: "https://explorer.re.al/tx/{HASH}",
        home_url: "https://explorer.re.al",
      },
      rpc: {
        public_servers_url: ["https://real.drpc.org", "wss://real.drpc.org"],
      },
      flags: {
        supports_trading: false,
        supports_sending: true,
        supports_bridge: false,
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related:
            "https://api.zerion.io/v1/fungibles/3b5814a4-7fa3-48e3-b389-638925def2cf",
        },
        data: {
          type: "fungibles",
          id: "3b5814a4-7fa3-48e3-b389-638925def2cf",
        },
      },
    },
    links: {
      self: "https://api.zerion.io/v1/chains/re-al",
    },
  },
];
