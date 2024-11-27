import {useNavigate} from "react-router-dom";
import {LevelSelectState} from "./LevelSelect";
import {ReviewState} from "./Review";
import {LogicGateLevelState} from "./Play";


interface RouteStateMap {
    "/intro": undefined;
    "/world-select": undefined;
    "/level-select": LevelSelectState;
    "/review": ReviewState;
    "/play": LogicGateLevelState;
}

type Navigate = <T extends keyof RouteStateMap>(
    path: T,
    options?: { state: RouteStateMap[T] }
) => void;

export const useTypedNavigate = (): Navigate => {
    const navigate = useNavigate();

    return (path, options) => {
        navigate(path, options);
    };
};