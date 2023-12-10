import "./InfoText.css"

// InfoText component is used to display information about the game during the placement phase
export const InfoText = () => {
    return (
        <div className={"flex-col infoText"}>
            <h4>Place your ships!</h4>
            <p  style={{width: "100%"}}>By clicking on one of the ships and then hovering your mouse over the gameboard you are able to place your ships.</p>
            <h4>Pro-tips: </h4>
            <p style={{width: "100%"}}>- <strong>press R</strong> to rotate your ship</p>
            <p  style={{width: "100%"}}>- <strong>Press Escape</strong> to deselect currently selected ship</p>
        </div>
    );
};
