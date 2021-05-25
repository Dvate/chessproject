import './style.css'
import Chessboard from 'chessboardjsx'
import Chess from 'chess.js'
import React, { Component } from 'react'
import movemp3 from '../../assets/sounds/public_sound_standard_Move.mp3'
import capturemp3 from '../../assets/sounds/public_sound_standard_Capture.mp3'
import errormp3 from '../../assets/sounds/public_sound_standard_Error.mp3'
import { Clock } from '../clock/Clock'


class WithValidation extends Component {
    game = new Chess()
    state = {
        fen: 'start',
        squareStyles: {},
        lastMoveStyles: {},
        inCheckStyles: {},
        rightClickStyles: {},
        history: []
    }
    // initiate sounds
    moveaudio = new Audio(movemp3)
    capturesaudio = new Audio(capturemp3)
    erroraudio = new Audio(errormp3)

    onSquareRightClick = square => {
        this.setState(prevState => ({
            rightClickStyles: {
                ...prevState.rightClickStyles,
                [square]: { backgroundColor: '#D2691E' }
            }
        }))
    }

    onSquareClick = square => {
        this.setState({
            rightClickStyles: {}
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

        console.log(this.game);

        if (move === null) {
            this.erroraudio.play()
            if (this.game.in_check()) {
                const turn = this.game.turn()
                const kingSquare = this.game.SQUARES.filter(square => {
                    return JSON.stringify(this.game.get(square)) === JSON.stringify({ type: 'k', color: turn })
                })
                this.setState({
                    inCheckStyles: {
                        [kingSquare]: {
                            backgroundColor: '#A52A2A'
                        }
                    }
                })
            }
        } else {
            const capturesRegex = new RegExp("x")

            this.setState({
                fen: this.game.fen(),
                history: this.game.history({ verbose: true }),
                lastMoveStyles: {
                    [sourceSquare]: {
                        backgroundColor: 'rgba(155,199,0,0.41)'
                    },
                    [targetSquare]: {
                        backgroundColor: 'rgba(155,199,0,0.41)'
                    }
                },
                inCheckStyles: {},
                rightClickStyles: {}
            })
            if (capturesRegex.test(move.san)) {
                this.capturesaudio.play()
            } else {
                this.moveaudio.play()
            }
        }
    };




    render() {
        const { squareStyles, fen, lastMoveStyles, inCheckStyles, rightClickStyles } = this.state
        return this.props.children({
            position: fen,
            squareStyles,
            onSquareRightClick: this.onSquareRightClick,
            onMouseOverSquare: this.onMouseOverSquare,
            onDrop: this.onDrop,
            onMouseOutSquare: this.onMouseOutSquare,
            lastMoveStyles: lastMoveStyles,
            inCheckStyles: inCheckStyles,
            rightClickStyles: rightClickStyles,
            onSquareClick: this.onSquareClick
        })
    }
}


export const Board = () => {
    return (
        <div className='container'>
            <div className='board'>
                <WithValidation>
                    {({
                        position,
                        squareStyles,
                        onSquareRightClick,
                        onMouseOverSquare,
                        onDrop,
                        onMouseOutSquare,
                        lastMoveStyles,
                        inCheckStyles,
                        rightClickStyles,
                        onSquareClick
                    }) => (
                        <Chessboard
                            boardStyle={boardStyles}
                            position={position}
                            onSquareRightClick={onSquareRightClick}
                            squareStyles={Object.assign({}, squareStyles, lastMoveStyles, inCheckStyles, rightClickStyles)}
                            onMouseOverSquare={onMouseOverSquare}
                            onDrop={onDrop}
                            onMouseOutSquare={onMouseOutSquare}
                            onSquareClick={onSquareClick}
                        />
                    )}
                </WithValidation>
                <Clock />
            </div>
        </div>
    )
}

const boardStyles = {
    borderRadius: '5px',
    boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
    margin: 'auto'
}