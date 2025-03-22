use std::hash::poseidon::bn254::hash_2;

// Just for testing flow
fn main(age: u8) -> pub Field {
    assert(age >= 18);
    hash_2([200, 100])
}
