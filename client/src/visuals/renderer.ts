import { game, width } from "../stores";

class RendererError extends Error {
    constructor(message: string) {
        super(message);
    }
}

async function imageBitmap(name: string) {
    const res = await fetch(`/sprites/${name}.png`);
    const blob = await res.blob();
    return createImageBitmap(blob);
}

async function shaderStr(name: string) {
    const res = await fetch(`/shaders/${name}.wgsl`);
    return res.text();
}

async function setup() {
    const canvas = document.querySelector('canvas');

    const gpu = navigator.gpu;
    const ctx = canvas.getContext('webgpu');
    if (!ctx || !gpu)
        throw new RendererError('WebGPU is not supported');

    const adapter = await gpu.requestAdapter();

    if (!adapter)
        throw new RendererError('No adapter found');

    const device = await adapter.requestDevice();
    const format = gpu.getPreferredCanvasFormat();
    ctx.configure({
        alphaMode: "premultiplied",
        device: device,
        format: format
    });

    return { ctx, device, format, canvas };
}

export default async function init() {
    const [renderer, troopsMap, rectStr] = await Promise.all([
        setup(),
        imageBitmap('troops'),
        shaderStr('rect')
    ])

    const pipeline = renderer.device.createRenderPipeline({
        layout: 'auto',
        vertex: {
            module: renderer.device.createShaderModule({
                code: rectStr
            }),
            entryPoint: 'vs_main',
        },
        fragment: {
            module: renderer.device.createShaderModule({
                code: rectStr
            }),
            entryPoint: 'fs_main',
            targets: [{
                format: renderer.format
            }]
        },
        primitive: {
            topology: 'triangle-strip'
        },
        multisample: {
            count: 4
        }
    });

    let renderTarget: GPUTexture;
    let renderTargetView: GPUTextureView;
    let size = [renderer.canvas.width, renderer.canvas.height];

    game.subscribe((game) => {
        if (!game) return;

        game.onTick = () => {
            const array = game.beers.map((beer) => {
                return [
                    beer.x,
                    beer.y,
                    .03,
                    .03,
                    0,
                    0,
                    0,
                    0,
                ];
            }).flat();

            renderer.device.queue.writeBuffer(
                positionBuffer,
                0,
                new Float32Array(array)
            );

            const aspect = renderer.canvas.width / renderer.canvas.height;

            renderer.device.queue.writeBuffer(
                infoBuffer,
                0,
                new Float32Array([aspect])
            );

            const encoder = renderer.device.createCommandEncoder();

            // resize?
            if (size[0] != renderer.canvas.width || size[1] != renderer.canvas.height || !renderTarget) {
                renderTarget?.destroy();

                size = [renderer.canvas.width, renderer.canvas.height];

                renderTarget = renderer.device.createTexture({
                    size,
                    format: renderer.format,
                    sampleCount: 4,
                    usage: GPUTextureUsage.RENDER_ATTACHMENT,
                });

                renderTargetView = renderTarget.createView();
            }

            const pass = encoder.beginRenderPass({
                colorAttachments: [{
                    view: renderTarget.createView(),
                    resolveTarget: renderer.ctx.getCurrentTexture().createView(),
                    loadOp: 'clear',
                    storeOp: 'store',
                }],
            });

            pass.setBindGroup(0, bindGroup);
            pass.setPipeline(pipeline);
            pass.draw(4, 5, 0, 0);
            pass.end();

            renderer.device.queue.submit([encoder.finish()]);
        }
    });


    const positionBuffer = renderer.device.createBuffer({
        size: 320,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const infoBuffer = renderer.device.createBuffer({
        size: 4,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const texture = renderer.device.createTexture({
        size: [troopsMap.width, troopsMap.height, 1],
        format: 'rgba8unorm',
        usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT
    });

    renderer.device.queue.copyExternalImageToTexture(
        { source: troopsMap },
        { texture },
        [troopsMap.width, troopsMap.height]
    );

    const sampler = renderer.device.createSampler({
        magFilter: 'linear',
        minFilter: 'linear',
    });

    const bindGroup = renderer.device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [{
            binding: 0,
            resource: {
                buffer: positionBuffer
            }
        },
        {
            binding: 1,
            resource: {
                buffer: infoBuffer,
            }
        },
        {
            binding: 2,
            resource: sampler
        },
        {
            binding: 3,
            resource: texture.createView()
        },
        ]
    });
}