import React, { useEffect, useMemo, useState } from "react";
import styles from "./TicTacToe.module.scss";
import { ReactComponent as CircleIcon } from "../assets/icons/circle.svg";
import { ReactComponent as CrossIcon } from "../assets/icons/cross.svg";
import { ReactComponent as Restart } from "../assets/icons/restart.svg";
import { gamelogic } from "../utils/helpers/gamelogic.ts";

const TicTacToe = () => {
  const [tileLogic, setTileLogic] = useState({});
  const [control, setControl] = useState<number>(0); // 0 for player one and 1 for player two
  const [finishGame, setFinishGame] = useState<boolean>(false);
  const [scoreDetails, setScoreDetails] = useState({
    player1: 0,
    player2: 0,
    tie: 0,
  });
  const [combination, setCombination] = useState<number[]>([]);
  const [tie, setTie] = useState(false);

  const tiles = useMemo(() => new Array(9).fill(0), []);

  let customTimeout;

  useEffect(() => {
    return () => clearTimeout(customTimeout); // It's a good practice to clear the timeout when the component is unmounted to avoid memory leaks.
  }, []);

  const tileClickHandler = (tileSelected: number) => () => {
    let tileLogicCopy = JSON.parse(JSON.stringify(tileLogic));

    if (tileLogicCopy[`tile-${tileSelected}`] === undefined) {
      tileLogicCopy[`tile-${tileSelected}`] = control;

      let tilesPlayed = Object.keys(tileLogicCopy).length;

      if (tilesPlayed !== 9) {
        let result = gamelogic(tileLogicCopy);

        if (result.winner === "player1" || result.winner === "player2") {
          customTimeout = setTimeout(() => {
            setFinishGame(true);
          }, 1500);

          setCombination(result.matchedCombination.map((el) => +el));
          setScoreDetails((prevState) => {
            let prevStateCopy = JSON.parse(JSON.stringify(prevState));
            prevStateCopy[result.winner] = prevStateCopy[result.winner] + 1;
            return prevStateCopy;
          });
          setTie(false);
        } else {
          setControl((prevState) => {
            if (prevState === 0) {
              return 1;
            } else {
              return 0;
            }
          });
        }

        setTileLogic((prevState) => {
          prevState[`tile-${tileSelected}`] = control;
          return prevState;
        });
      } else {
        setTie(true);
        setFinishGame(true);
      }
    }
  };

  const restartClickHandler = () => {
    setTileLogic({});
    setControl((prevState) => {
      if (prevState === 0) {
        return 1;
      } else {
        return 0;
      }
    });
    setFinishGame(false);
    setCombination([]);
    setTie(false);
    clearTimeout(customTimeout);
  };

  return (
    <div className={styles["game-header-container"]}>
      <div className={styles["game-heading"]}>
        Tic <span>Tac</span> Toe
      </div>
      <div className={styles["game-details-btn-container"]}>
        <div className={styles["game-details-container"]}>
          <div
            className={styles["player-1-container"]}
            style={control === 0 ? { color: "rgb(243 178 54)" } : {}}
          >
            P1(X): {scoreDetails["player1"]}
          </div>
          <div
            className={styles["player-2-container"]}
            style={control === 1 ? { color: "rgb(243 178 54)" } : {}}
          >
            P2(O): {scoreDetails["player2"]}
          </div>
        </div>
        <div className={styles["restart-btn-container"]}>
          <button
            className={styles["restart-btn"]}
            onClick={restartClickHandler}
          >
            <Restart />
          </button>
        </div>
      </div>
      <div className={styles["game-container"]}>
        {finishGame && (
          <div className={styles["white-film"]}>
            <div className={styles["end-game-modal-container"]}>
              <div className={styles["end-game-heading-container"]}>
                {tie ? (
                  <h2>It's a TIE!</h2>
                ) : (
                  <h2>Player-{control + 1} won!</h2>
                )}
              </div>
              <div className={styles["end-game-btn-container"]}>
                {/* <div
                  className={`${styles["ai-btn"]} ${styles["end-game-btn"]}`}
                >
                  vs AI
                </div> */}
                <div
                  className={`${styles["sng-btn"]} ${styles["end-game-btn"]}`}
                  onClick={restartClickHandler}
                >
                  New Game
                </div>
              </div>
            </div>
          </div>
        )}
        {tiles.map((tile, index: number) => (
          <div
            className={`${styles["tile"]} ${
              styles[`game-container-tile-${index + 1}`]
            }`}
            onClick={tileClickHandler(index)}
          >
            {tileLogic[`tile-${index}`] !== undefined ? (
              tileLogic[`tile-${index}`] === 0 ? (
                <div
                  className={`${styles["cross-icon"]} ${
                    combination.includes(index) && styles["animation"]
                  }`}
                >
                  <CrossIcon />
                </div>
              ) : (
                <div
                  className={`${styles["circle-icon"]} ${
                    combination.includes(index) && styles["animation"]
                  }`}
                >
                  <CircleIcon />
                </div>
              )
            ) : (
              <div></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicTacToe;
