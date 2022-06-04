import { InterpolationModes } from "three";

export type AnimationKeyFrameJson = {
  name: string;
  type: string;
  times: number[];
  values: number[];
  interpolation?: InterpolationModes;
};

export type AnimationClipJson = {
  duration: number;
  tracks: AnimationKeyFrameJson[];
};
