global HONK_VK_SIZE: u32 = 128;
global HONK_PROOF_SIZE: u32 = 456;
global HONK_IDENTIFIER: u32 = 1;
global MAX_ACTIONS: u32 = 3;

struct rec {
    verificationKey: [Field; HONK_VK_SIZE],
    proof: [Field; HONK_PROOF_SIZE],
}

fn main(
    recursive: [rec; MAX_ACTIONS],
    publicInputs: [[Field; 2]; MAX_ACTIONS],
) {
    for i in 0..MAX_ACTIONS{

    std::verify_proof_with_type(
        recursive[i].verificationKey,
        recursive[i].proof,
        publicInputs[i],
        0x0,
        HONK_IDENTIFIER,
    );
    }
}

