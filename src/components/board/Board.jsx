import './style.css'
import Chessboard from 'chessboardjsx'
import Chess from 'chess.js'
import React, { Component } from 'react'


class WithValidation extends Component {
    game = new Chess()
    state = {
        fen: 'start',
        square: '',
        squareStyles: {},
        history: []
    }

    // onSquareRightClick = square => {
    //     this.setState({
    //         squareStyles: { [square]: { backgroundColor: '#D2691E' } },
    //     })
    // }

    onMouseOverSquare = square => {
        console.log(square);
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

    onMouseOutSquare = square => {
        this.setState({
            squareStyles: { [square]: { backgroundColor: 'none' } },
        })
    }

    onDrop = ({ sourceSquare, targetSquare }) => {
        let move = this.game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q"
        });

        if (move === null) return;
        this.setState({
            fen: this.game.fen(),
            history: this.game.history({ verbose: true }),
            squareStyles: {
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
        const { squareStyles, fen } = this.state
        return this.props.children({
            position: fen,
            squareStyles,
            onSquareRightClick: this.onSquareRightClick,
            onMouseOverSquare: this.onMouseOverSquare,
            onDrop: this.onDrop,
            onMouseOutSquare: this.onMouseOutSquare
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
                    onMouseOutSquare
                }) => (
                    <Chessboard
                        boardStyle={boardStyles}
                        position={position}
                        onSquareRightClick={onSquareRightClick}
                        squareStyles={squareStyles}
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