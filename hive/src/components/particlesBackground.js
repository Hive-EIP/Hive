import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import options from "../assets/particles_hive_theme.json";

const ParticlesBackground = () => {
    const particlesInit = useCallback(async (engine) => {
        await loadSlim(engine);
    }, []);

    return (
        <>
            <div className="background-layer" />
            <Particles
                id="tsparticles"
                init={particlesInit}
                options={options}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 0
                }}
            />
        </>
    );
};

export default ParticlesBackground;
