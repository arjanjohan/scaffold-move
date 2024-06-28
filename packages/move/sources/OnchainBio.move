module OnchainBio::onchain_bio {
  use std::string::{String};
  use std::signer;

  struct Bio has key, store, drop {
      name: String,
      bio: String,
  }

  public entry fun register(account: &signer, name: String, bio: String) acquires Bio {
    // Check if an Bio already exists for the account
    if (exists<Bio>(signer::address_of(account))) {
      // Remove the existing Bio
      let _old_Bio = move_from<Bio>(signer::address_of(account));
    };
    // Create the new Bio
    let bio = Bio {
      name,
      bio,
    };
    // Store the new Bio under the account
    move_to<Bio>(account, bio);
  }

  #[view]
  public fun get_bio(account: address): String acquires Bio {
    let bio = borrow_global<Bio>(account);
    bio.bio
  }
}
