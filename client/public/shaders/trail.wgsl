struct RenderInfo {
    aspect: f32,
}

@group(0) @binding(0) var<uniform> positions: array<vec4<f32>, 10>;
// @group(0) @binding(1) var<uniform> info: RenderInfo;

@vertex
fn vs_main(
    @builtin(vertex_index) in_vertex_index: u32,
    @builtin(instance_index) in_instance_index: u32,
) -> @builtin(position) vec4<f32> {
    return vec4<f32>(positions[in_vertex_index].xy, 0.0, 1.0);
}

@fragment
fn fs_main() -> @location(0) vec4<f32> {
    return vec4<f32>(1.0, 0.0, 0.0, 1.0);
}