import './style.css'
import Chessboard from 'chessboardjsx'
import Chess from 'chess.js'
import React, { Component } from 'react'
import movemp3 from '../../assets/sounds/public_sound_standard_Move.mp3'
import capturemp3 from '../../assets/sounds/public_sound_standard_Capture.mp3'


class WithValidation extends Component {
    game = new Chess()
    state = {
        fen: 'start',
        square: '',
        squareStyles: {},
        lastMoveStyles: {},
        history: []
    }
    // initiate sounds
    moveaudio = new Audio(movemp3)
    capturesaudio = new Audio(capturemp3)

    onSquareRightClick = square => {
        this.setState({
            squareStyles: { [square]: { backgroundColor: '#D2691E' } },
        })
    }

    onMouseOverSquare = square => {
        this.setState({
            squareStyles: { [square]: { backgroundColor: 'none' } },
        })
        let moves = this.game.moves({
            square: square,
            verbose: true
        });
        if (moves.length === 0) return;
        let squaresToHighlight = [];
        for (let i = 0; i < moves.length; i++) {
            squaresToHighlight.push(moves[i].to);
        }
        squaresToHighlight.map(square =>
            this.setState(prevState => ({
                squareStyles: {
                    ...prevState.squareStyles,
                    [square]: {
                        background:
                            "radial-gradient(rgba(20,85,30,0.5) 19%, rgba(0,0,0,0) 20%)",
                        borderRadius: "50%"
                    }
                }
            }))
        )
    }

    onDrop = ({ sourceSquare, targetSquare }) => {
        let move = this.game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q"
        });

        if (move === null) return;

        const capturesRegex = new RegExp("x")
        if(capturesRegex.test(move.san)) {
            this.capturesaudio.play()
        } else {
            this.moveaudio.play()
        }

        this.setState({
            square: targetSquare,
            fen: this.game.fen(),
            history: this.game.history({ verbose: true }),
            lastMoveStyles: {
                [sourceSquare]: {
                    backgroundColor: 'rgba(155,199,0,0.41)'
                },
                [targetSquare]: {
                    backgroundColor: 'rgba(155,199,0,0.41)'
                }
            }
        })
    };


    render() {
        const { squareStyles, fen, lastMoveStyles } = this.state
        return this.props.children({
            position: fen,
            squareStyles,
            onSquareRightClick: this.onSquareRightClick,
            onMouseOverSquare: this.onMouseOverSquare,
            onDrop: this.onDrop,
            onMouseOutSquare: this.onMouseOutSquare,
            lastMoveStyles: lastMoveStyles
        })
    }
}


export const Game = () => {
    return (
        <div>
            <WithValidation>
                {({
                    position,
                    squareStyles,
                    onSquareRightClick,
                    onMouseOverSquare,
                    onDrop,
                    onMouseOutSquare,
                    lastMoveStyles
                }) => (
                    <Chessboard
                        boardStyle={boardStyles}
                        position={position}
                        onSquareRightClick={onSquareRightClick}
                        squareStyles={Object.assign({}, squareStyles, lastMoveStyles)}
                        onMouseOverSquare={onMouseOverSquare}
                        onDrop={onDrop}
                        onMouseOutSquare={onMouseOutSquare}
                    />
                )}
            </WithValidation>
        </div>
    )
}

const boardStyles = {
    borderRadius: '5px',
    boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
    margin: 'auto',
    paddingTop: '5%'
}