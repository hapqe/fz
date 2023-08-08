export function getCode() {
    return new URLSearchParams(window.location.search).get("j");
}