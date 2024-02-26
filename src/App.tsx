import "./App.css";
import { useRef, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable";
import {
  CameraFlyTo,
  Cesium3DTileset,
  CesiumComponentRef,
  Viewer,
} from "resium";
import Cesium, {
  Cartesian3,
  Viewer as CesiumViewer,
  Clock,
  ClockRange,
  ClockStep,
  ClockViewModel,
  IonResource,
  JulianDate,
} from "cesium";
import { Slider } from "./components/ui/slider";
import GoogleMapsOverlay from "./components/map/GoogleMaps";
import { Checkbox } from "./components/ui/checkbox";
import { Button } from "./components/ui/button";

const buildingIDs = [
  2437470, 2437890, 2437891, 2437892, 2437893, 2437894, 2437895, 2437896,
  2437897, 2437898, 2437899, 2437901,
];

const BUILDING_COORDINATES = [6.0603581, 50.7797344];

const getResource = (id: number) =>
  IonResource.fromAssetId(id, {
    accessToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0OGVlN2ZkYS0yOGM5LTQzYTctYWRmNy1mMGMwZjc3OTgwYmUiLCJpZCI6ODI2MDksImlhdCI6MTcwNjMwNDE4MH0.2XYoZb1qMar5GO7vhYEUzL4rOnzfcFg6WRs79KjBDh0",
  });

const clock = new Clock({
  startTime: JulianDate.fromIso8601("2023-06-21"),
  currentTime: JulianDate.fromIso8601("2023-06-21T12:00:00Z"),
  stopTime: JulianDate.fromIso8601("2023-06-30"),
  clockRange: ClockRange.LOOP_STOP,
  clockStep: ClockStep.SYSTEM_CLOCK_MULTIPLIER,
});

let clockViewModel = new ClockViewModel(clock);

function App() {
  const viewer = useRef<CesiumComponentRef<CesiumViewer>>(null);
  const [id, setId] = useState<number>(buildingIDs[0]);
  const [building, setBuilding] = useState<Promise<IonResource> | null>(
    getResource(id)
  );

  const [toggles, setToggles] = useState<{
    building?: boolean;
    solarRadiation?: boolean;
  }>({
    building: true,
    solarRadiation: false,
  });

  const assignBuilding = (id: number) => {
    const resource = getResource(id);
    setId(id);
    setBuilding(resource);
  };

  const convertIndexToMonth = (id: number) => {
    const index = buildingIDs.indexOf(id);

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return months[index];
  };

  return (
    <div className="bg-black">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel maxSize={30} minSize={20}>
          <div className="h-screen p-10 bg-slate-800 space-y-10">
            <div className="space-y-5">
              <h1 className="text-2xl font-bold text-white">
                Building ID: {id}
              </h1>
              <h1 className="text-2xl font-bold text-white">
                Month: {convertIndexToMonth(id)}
              </h1>
            </div>

            <div className="space-y-5">
              <div className="gap-2">
                <Checkbox
                  className="h-8 w-8"
                  checked={toggles.building}
                  onCheckedChange={(value) => {
                    setToggles({
                      ...toggles,
                      building: value === true,
                    });
                  }}
                />
                <p className="text-white">Building</p>
              </div>
              <div className="gap-2">
                <Checkbox
                  className="h-8 w-8"
                  checked={toggles.solarRadiation}
                  onCheckedChange={(value) => {
                    setToggles({
                      ...toggles,
                      solarRadiation: value === true,
                    });
                  }}
                />
                <p className="text-white">Solar Radiation</p>
              </div>
            </div>

            <div>
              <p className="text-white mb-5">Change month:</p>
              <Slider
                min={0}
                max={11}
                step={1}
                onValueChange={([value]) => {
                  assignBuilding(buildingIDs[value]);
                }}
              />
            </div>

            <div>
              <Button
                onClick={() => {
                  viewer.current?.cesiumElement?.camera.flyTo({
                    destination: Cartesian3.fromDegrees(
                      BUILDING_COORDINATES[0],
                      BUILDING_COORDINATES[1],
                      600
                    ),
                    complete: () => {
                      viewer.current?.cesiumElement?.camera.lookAt(
                        Cartesian3.fromDegrees(
                          BUILDING_COORDINATES[0],
                          BUILDING_COORDINATES[1],
                          600
                        ),
                        new Cartesian3(-60, -120, 70)
                      );
                    },
                  });
                }}
              >
                Focus on building
              </Button>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <div>
            <Viewer
              timeline={false}
              animation={false}
              sceneModePicker
              baseLayerPicker
              shadows
              infoBox
              selectionIndicator
              ref={viewer}
              className="h-screen w-auto"
              clockViewModel={clockViewModel}
            >
              <GoogleMapsOverlay />
              <CameraFlyTo
                once
                destination={Cartesian3.fromDegrees(
                  BUILDING_COORDINATES[0],
                  BUILDING_COORDINATES[1],
                  600
                )}
                onComplete={() => {
                  viewer.current?.cesiumElement?.camera.lookAt(
                    Cartesian3.fromDegrees(
                      BUILDING_COORDINATES[0],
                      BUILDING_COORDINATES[1],
                      600
                    ),
                    new Cartesian3(-60, -120, 70)
                  );
                }}
              />

              {toggles.building && (
                <Cesium3DTileset url={getResource(2442486)} />
              )}
              {building && toggles.solarRadiation && (
                <Cesium3DTileset key={id} url={building} />
              )}
            </Viewer>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default App;
