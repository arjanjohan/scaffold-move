module OnchainBio::onchain_poems {

  use std::string::{String};

  struct Inscription has key, store, drop {
      poem: String,
      title: String,
      author: String
  }

  const E_ALREADY_HAS:u64 = 1;

  public entry fun register (account: &signer, poem: String, title: String, author: String) {
    let inscription = Inscription {
      poem: poem,
      title: title,
      author: author
    };
    move_to<Inscription>(account, inscription);
  }

  #[view]
  public fun get_poem (account: address): String acquires Inscription {
    let poem = borrow_global<Inscription>(account);
    poem.poem
  }
}