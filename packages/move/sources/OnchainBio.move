module deployment_addr::onchain_bio {
  use std::string::String;
  use std::signer;

  struct Bio has key, store, drop {
    name: String,
    bio: String,
  }

  public entry fun register(account: &signer, name: String, bio: String) acquires Bio {
    let addr = signer::address_of(account);
    if (exists<Bio>(addr)) {
      // Update the existing Bio
      let existing = &mut Bio[addr];
      existing.name = name;
      existing.bio = bio;
    } else {
      move_to(account, Bio { name, bio });
    }
  }

  #[view]
  public fun get_bio(account: address): String acquires Bio {
    Bio[account].bio
  }
}
