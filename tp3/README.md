# SGI DEMO - Camull-Rom curve as a path

This demo presents one possible approach to creating flat 3D objects from a catmull-rom curve, using TubeGeometry with 3 slices.
In the context of TP3, this provides insight into how a race track can be created using this type of curve.

## How it was implemented

TubeGeometry receives a curve and creates a hollow cylinder around it, with a variable number of radial and tubular segments (we usually call these slices and stacks). Using 2 radial segments provides a flat geometry, but controlling the direction that the surface is facing can be complicated. So in this example we use 3 radial segments, which creates a triangular shape, and then scale it to flatten it down. This makes the process of creating a flat curved object easier, but has some downsides/conditions, as described below.

## Important notes
When using this for TP3, it is important to note:

- The catmull-rom curve used for the geometry is not closed (start/end point are not the same). This example shows how the tube geometry deals with this situation according to its closed parameter (test the closedCurve checkbox). Note how the resulting geometry changes a bit when this parameter changes.
- The way the texture is mapped in the geometry (wrapping on the front and back of the curve). The repeat factor in V is 3, so that it is fully displayed in the visible face.
- Sharp curves may lead to problems in the polygons (e.g., overlapping polygons), so the curve points must be defined with this in mind.
- We have many unnecessary polygons due to the number of segments (triple the necessary number).

This approach can be a good starting point, but we suggest exploring other more efficient methods (i.e., creating a BufferGeometry and calculating the necessary vertices from the curve points).
