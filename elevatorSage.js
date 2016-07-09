{
    //Solves (sometimes multiple tries) 1-4, 8, 9
    //This is currently a mish mash file that I decided I should probably commit after I got to challenge 10 (it previously also solved 5, 6, and 7 too)
    init: function(elevators, floors) {
        var floorsToVisit = [];

        //This is currently adding unneeded complexity, but I had grand designs to make a scheduling algorithm to make it so people waited the least amount possible
        function newFloorPush(floorNumber) {
            return { number: floorNumber, time: new Date() };
        }

        function processAllElevatorsMoves() {
            for (var i = 0; i < elevators.length; i++) {
                elevators[i].processMove();
            }
        }

        function bindElevatorEvents(elevator) {
            elevator.floorsToVisit = [];

            elevator.getClosestFloorPush = function () {
                var closestFloorPush = 0,
                    currentFloor = this.currentFloor();
                
                for (var i = 0; i < this.floorsToVisit.length; i++) {
                    if (Math.abs(currentFloor - this.floorsToVisit[i].number) < Math.abs(currentFloor - this.floorsToVisit[closestFloorPush].number)) {
                        closestFloorPush = 0;
                    }
                }
                
                return this.floorsToVisit[closestFloorPush].number;
            }

            elevator.processMove = function () {
                if (!this.idle) {
                    return;
                }

                if (this.floorsToVisit.length) {
                    this.goToFloor(this.getClosestFloorPush());
                }
                else {
                    if (floorsToVisit.length) {
                        console.log("allFloors1", floorsToVisit)
                        var goFloor = floorsToVisit.splice(0,1)[0];
                        console.log("visiting global floor", goFloor);
                        this.goToFloor(goFloor.number);
                    }
                    else {
                        console.log("Still idle", floorsToVisit, this.floorsToVisit);
                        this.idle = true;
                    }
                }
            }

            elevator.on("floor_button_pressed", function(floorNum) {
                var newFloor = newFloorPush(floorNum);
                console.log("here is a floor0", newFloor);
                elevator.floorsToVisit.push(newFloor);
                elevator.processMove();
            });

            elevator.on("stopped_at_floor", function(floorNum) {
                this.floorsToVisit = this.floorsToVisit.filter(function (f) { return f.number != floorNum; });
                floorsToVisit = floorsToVisit.filter(function (f) { return f.number != floorNum; });
            })

            elevator.on("idle", function() {
                this.idle = true;
                this.processMove();
            });
        }

        for (var i = 0; i < elevators.length; i++) {
            bindElevatorEvents(elevators[i]);
        }

        for(var i = 0; i < floors.length; i++) {
            var floor = floors[i];

            floor.on("up_button_pressed down_button_pressed", function() {
                floorsToVisit.push(newFloorPush(this.floorNum()));

                processAllElevatorsMoves();
            });
        }
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}