class RendererError extends Error {
    constructor(message: string) {
        super(message);
    }
}

class Image {
    constructor() {

    }
}

export class Renderer {
    static async init(canvas: HTMLCanvasElement) {
        const gpu = navigator.gpu;
        const ctx = canvas.getContext('webgpu');
        if (!ctx || !gpu)
            throw new RendererError('WebGPU is not supported');

        const adapter = await gpu.requestAdapter();

    }
}