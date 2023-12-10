import {useOutlet} from "react-router-dom";
import {InfoBar} from "./InfoBar.tsx";

export const Layout = () => {
    const outlet = useOutlet()
    return (
        <>
            <InfoBar />
            {outlet}
        </>
    );
};
