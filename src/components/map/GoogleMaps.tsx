import { useCesium } from "resium";
import { createGooglePhotorealistic3DTileset } from "cesium";
import { useEffect } from "react";

const getGoogleMaps = async () => {
  try {
    const googleMaps3DTileset = await createGooglePhotorealistic3DTileset();
    return googleMaps3DTileset;
  } catch {
    console.error("failed to load tiles");
  }
};

const GoogleMapsOverlay = () => {
  const { viewer } = useCesium();

  useEffect(() => {
    (async () => {
      const googleMaps3DTileset = await getGoogleMaps().then(
        (response) => response
      );
      viewer?.scene.primitives.add(googleMaps3DTileset);
    })();
  }, []);

  return null;
};

export default GoogleMapsOverlay;
