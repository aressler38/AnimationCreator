#!/bin/bash -x

root_dir="/opt/AnimationCreator"
build_dir="$root_dir/build"
node="node"


$node $build_dir/r.js -o $build_dir/build.js
