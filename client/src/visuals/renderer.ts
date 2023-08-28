import { Vec2 } from "../../../game/math";
import initInput, { getInput } from "../input";
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
    const [renderer, trailStr] = await Promise.all([
        setup(),
        shaderStr('trail')
    ])

    const pipeline = renderer.device.createRenderPipeline({
        layout: 'auto',
        vertex: {
            module: renderer.device.createShaderModule({
                code: trailStr
            }),
            entryPoint: 'vs_main',
        },
        fragment: {
            module: renderer.device.createShaderModule({
                code: trailStr
            }),
            entryPoint: 'fs_main',
            targets: [{
                format: renderer.format
            }]
        },
        primitive: {
            topology: 'line-strip',
        },
        multisample: {
            count: 4
        }
    });

    function getSize() {
        return [
            renderer.canvas.width,
            renderer.canvas.height
        ]
    }

    let renderTarget: GPUTexture;
    let renderTargetView: GPUTextureView;
    let size = getSize();

    const positionBuffer = renderer.device.createBuffer({
        size: 2000,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const infoBuffer = renderer.device.createBuffer({
        size: 4,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const bindGroup = renderer.device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: positionBuffer
                }
            },
            // {
            //     binding: 1,
            //     resource: {
            //         buffer: infoBuffer,
            //     }
            // }
        ]
    });

    game.subscribe((game) => {
        if (!game) return;

        initInput();

        let positions: Vec2[] = [];
        function render() {
            const input = getInput();
            console.log(input);

            if (input.magnitude > 0.001)
                positions.push(input);



            // only 10 newest positions
            positions = positions.slice(-20);

            const top: Vec2[] = [];
            for (let i = 0; i < positions.length; i++) {
                // const current = positions[i];
                // const next = positions[i + 1];

                // if (!next) break;

                // const x = Vec2.sub(next, current);
                // console.log(x.magnitude);


                // console.log(Vec2.sub(next, current).normalized.magnitude);


                // const normal = Vec2.mul(, 0.1);

                // top.push(Vec2.add(current, normal));
            }

            // get normalized mouse pos
            renderer.device.queue.writeBuffer(
                positionBuffer,
                0,
                new Float32Array(top.flatMap(p => [p.x, p.y, 0, 0]))
            );

            const aspect = renderer.canvas.width / renderer.canvas.height;

            renderer.device.queue.writeBuffer(
                infoBuffer,
                0,
                new Float32Array([aspect])
            );

            const encoder = renderer.device.createCommandEncoder();

            const newSize = getSize();
            if (size[0] !== newSize[0] || size[1] !== newSize[1] || !renderTarget) {
                renderTarget?.destroy();

                size = newSize;

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
                    view: renderTargetView,
                    resolveTarget: renderer.ctx.getCurrentTexture().createView(),
                    loadOp: 'clear',
                    storeOp: 'store',
                }],
            });

            pass.setBindGroup(0, bindGroup);
            pass.setPipeline(pipeline);
            pass.draw(positions.length, 1, 0, 0);
            pass.end();

            renderer.device.queue.submit([encoder.finish()]);

            requestAnimationFrame(render);
        }
        render();
    });
}