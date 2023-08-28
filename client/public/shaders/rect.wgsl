struct Sprite {
    position: vec2<f32>,
    size: vec2<f32>,
    frame: vec2<f32>,
    rotation: vec2<f32>,
}

struct RenderInfo {
    aspect: f32,
}

@group(0) @binding(0) var<uniform> sprites: array<Sprite, 10>;
@group(0) @binding(1) var<uniform> info: RenderInfo;
@group(0) @binding(2) var sheetSampler: sampler;
@group(0) @binding(3) var sheetTexture: texture_2d<f32>;

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
}

@vertex
fn vs_main(
    @builtin(vertex_index) in_vertex_index: u32,
    @builtin(instance_index) in_instance_index: u32,
) -> VertexOutput {
    let sprite = sprites[in_instance_index];

    var positions = array<vec2<f32>, 4>(
        vec2<f32>(-1.0, -1.0),
        vec2<f32>(-1.0, 1.0),
        vec2<f32>(1.0, -1.0),
        vec2<f32>(1.0, 1.0),
    );

    var output: VertexOutput;
    let p = positions[in_vertex_index] * sprite.size * vec2<f32>(1.0, info.aspect) + sprite.position;
    output.position = vec4<f32>(p, 0.0, 1.0);
    output.uv = positions[in_vertex_index] * .5 + .5;
    return output;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    return textureSample(
        sheetTexture,
        sheetSampler,
        in.uv,
    );
}