// import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const moveContracts = {
  ONCHAIN_BIO: {
    address: "0x4295cca96321b2807473c0df06fa0ec4b1e22e612f8577cc36406d8c0e67630c",
    modules: {
      onchain_bio: {
        name: "onchain_bio",
        resources: {
          Bio: "Bio",
        },
        functions: {
          register: "register",
          get_bio: "get_bio",
        },
      },
      onchain_poems: {
        name: "onchain_poems",
        resources: {
          Inscription: "Inscription",
        },
        functions: {
          register: "register",
          get_bio: "get_poem",
        },
      },
      onchain_poems_with_table: {
        name: "onchain_poems_with_table",
        resources: {
          PoemList: "PoemList",
        },
        functions: {
          register: "create_poem_list",
          get_bio: "create_poem",
        },
      },
    },
  },
} as const;

export default moveContracts;
// export default deployedContracts satisfies GenericContractsDeclaration;
