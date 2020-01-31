export function ensure(check: boolean, error?: string) {
    if(check) {
        return;
    }
    throw Error(error || "Check failed");
}