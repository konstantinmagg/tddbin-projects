function createBoard(index) {
    return {
        generation: index ? index : 0,
        fields: [] // empty arrays
    };
}

function countLivingNeighbours(fields, primaryCoordinate, secondaryCoordinate) {
    var sum = -fields[primaryCoordinate][secondaryCoordinate];

    for (var primaryIndex = -1; primaryIndex < 2; primaryIndex++) {
        var primary = primaryCoordinate + primaryIndex;

        if (primary >= 0 && primary < fields.length) {

            for (var secondaryIndex = -1; secondaryIndex < 2; secondaryIndex++) {
                var secondary = secondaryCoordinate + secondaryIndex;

                if (secondary >= 0 && secondary < fields[primary].length) {
                    var value = fields[primary][secondary];
                    if (value === undefined) {
                        value = 0;
                    }

                    sum += value;
                }
            }
        }
    }

    return sum;
}

function play(board) {
    var nextGeneration = createBoard(board.generation + 1);

    board.fields.forEach(function(element, primaryIndex, primaryArray) {
        var column = [];
        element.forEach(function(element, secondaryIndex, array) {
            var livingNeighbourCount = countLivingNeighbours(primaryArray, primaryIndex, secondaryIndex);

            // implement rules here
            //// var nextGenerationValue = (element && livingNeighbourCount > 1 && livingNeighbourCount < 4) || (!element && livingNeighbourCount === 3);
            var nextGenerationValue = livingNeighbourCount === 3 || (livingNeighbourCount === 2 && element);

            column.push(nextGenerationValue);
        });
        nextGeneration.fields.push(column);
    });

    return nextGeneration;
}

describe('board', function() {

    describe('createBoard() function', function() {

        it('sets the "generation" counter', function() {
            const counter = 9;
            var board = createBoard(counter);
            assert.equal(counter, board.generation);
        });

        it('initializes a "generation" counter, when argument is empty', function() {
            var board = createBoard();
            assert.equal(0, board.generation);
        });

        it('initializes "fields" with empty arrays', function() {
            var board = createBoard(6);
            assert.deepEqual([], board.fields);
        });

    });

    describe('countLivingNeighbours() function', function() {
        var fieldOne = [
            [0, 1, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        var fieldTwo = [
            [1, 1, 0],
            [0, 0, 1],
            [1, 0, 0]
        ];
        var fieldThree = [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1]
        ];

        describe('count central field', function() {
            it('array with one neighbour', function() {
                assert.equal(1, countLivingNeighbours(fieldOne, 1, 1));
            });
            it('array with four neighbours', function() {
                assert.equal(4, countLivingNeighbours(fieldTwo, 1, 1));
            });
            it('array with eight neighbours', function() {
                assert.equal(8, countLivingNeighbours(fieldThree, 1, 1));
            });
        });

        describe('count border field', function() {
            it('array with one neighbour', function() {
                assert.equal(1, countLivingNeighbours(fieldOne, 1, 0));
            });
            it('array with four neighbours', function() {
                assert.equal(1, countLivingNeighbours(fieldTwo, 1, 2));
            });
            it('array with eight neighbours', function() {
                assert.equal(5, countLivingNeighbours(fieldThree, 1, 2));
            });
        });

        describe('count edge field', function() {
            it('array with one neighbour', function() {
                assert.equal(1, countLivingNeighbours(fieldOne, 0, 0));
            });
            it('array with four neighbours', function() {
                assert.equal(2, countLivingNeighbours(fieldTwo, 0, 2));
            });
            it('array with eight neighbours', function() {
                assert.equal(3, countLivingNeighbours(fieldThree, 2, 2));
            });
        });

    });
});

describe('game of life', function() {

    it('should increment the generation counter', function() {
        var board = createBoard(7);
        var result = play(board);
        assert.equal(8, result.generation);
    });

    describe('Any live cell with fewer than two live neighbours dies', function() {

        it('cell with "0" neighbours dies', function() {
            var board = createBoard();
            board.fields.push([0, 0, 0]);
            board.fields.push([0, 1, 0]);
            board.fields.push([0, 0, 0]);

            var result = play(board);

            assert.equal(0, result.fields[1][1]);
        });

        it('cell with "1" neighbour dies', function() {
            var board = createBoard();
            board.fields.push([1, 0, 0]);
            board.fields.push([0, 1, 0]);
            board.fields.push([0, 0, 0]);

            var result = play(board);

            assert.equal(0, result.fields[1][1]);
        });

        it('dead cell with "1" neighbour stays dead', function() {
            var board = createBoard();
            board.fields.push([1, 0, 0]);
            board.fields.push([0, 0, 0]);
            board.fields.push([0, 0, 0]);

            var result = play(board);

            assert.equal(0, result.fields[1][1]);
        });

    });

    describe('Any live cell with two or three live neighbours lives', function() {
        it('cell with "2" neighbours lives', function() {
            var board = createBoard();
            board.fields.push([0, 0, 1]);
            board.fields.push([0, 1, 0]);
            board.fields.push([1, 0, 0]);

            var result = play(board);

            assert.equal(1, result.fields[1][1]);
        });

        it('dead cell with "2" neighbours stays dead', function() {
            var board = createBoard();
            board.fields.push([0, 0, 1]);
            board.fields.push([0, 0, 0]);
            board.fields.push([1, 0, 0]);

            var result = play(board);

            assert.equal(0, result.fields[1][1]);
        });

        it('cell with "3" neighbours lives', function() {
            var board = createBoard();
            board.fields.push([0, 0, 1]);
            board.fields.push([0, 1, 1]);
            board.fields.push([1, 0, 0]);

            var result = play(board);

            assert.equal(1, result.fields[1][2]);
        });

    });

    describe('Any live cell with more than three live neighbours die', function() {
        it('cell with "4" neighbours lives', function() {
            var board = createBoard();
            board.fields.push([0, 1, 1]);
            board.fields.push([0, 1, 0]);
            board.fields.push([1, 1, 0]);

            var result = play(board);

            assert.equal(0, result.fields[1][1]);
        });

        it('dead cell with "4" neighbours stays dead', function() {
            var board = createBoard();
            board.fields.push([0, 1, 1]);
            board.fields.push([0, 0, 0]);
            board.fields.push([1, 1, 0]);

            var result = play(board);

            assert.equal(0, result.fields[1][1]);
        });
    });

    describe('Any dead cell with exactly three live neighbours becomes a live cell', function() {
        it('dead cell with exactly "3" neighbours comes to life', function() {
            var board = createBoard();
            board.fields.push([0, 1, 1]);
            board.fields.push([1, 0, 0]);
            board.fields.push([0, 0, 0]);

            var result = play(board);

            assert.equal(1, result.fields[1][1]);
        });
    });

});
