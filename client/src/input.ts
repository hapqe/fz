import { Vec2 } from "../../game/math";

let input = Vec2.zero;

export default function initInput() {
    const mobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (mobileDevice) {
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
            input.x = e.touches[0].clientX / window.innerWidth * 2 - 1;
            input.y = -e.touches[0].clientY / window.innerHeight * 2 + 1;
        });
    }

    document.addEventListener('mousemove', (e) => {
        input.x = e.clientX / window.innerWidth * 2 - 1;
        input.y = -e.clientY / window.innerHeight * 2 + 1;
    });
}

export function getInput() {
    return structuredClone(input);
}