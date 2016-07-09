{
    //Solves (sometimes multiple tries) 1-4, 8, 9
    //This is currently a mish mash file that I decided I should probably commit after I got to challenge 10 (it previously also solved 5, 6, and 7 too)
    init: function(elevators, floors) {
        var floorsToVisit = [];

        function newFloorPush(floorNumber) {
            return { number: floorNumber, time: new Date() };
        }
        
        function getClosestFloorPush(currentFloor, floorPushes) {
            var closestFloorPush = 0;
            
            for (var i = 0; i < floorPushes.length; i++) {
                if (Math.abs(currentFloor - floorPushes[i].number) < Math.abs(currentFloor - floorPushes[closestFloorPush].number)) {
                    closestFloorPush = 0;
                }
            }
            
            return floorPushes[closestFloorPush].number;
        }

        function processElevatorMove(elevator) {
            if (!elevator.idle) {
                return;
            }

            if (elevator.floorsToVisit.length) {
                elevator.goToFloor(getClosestFloorPush(elevator.currentFloor(),elevator.floorsToVisit));
            }
            else {
                if (floorsToVisit.length) {
                    console.log("allFloors1", floorsToVisit)
                    var goFloor = floorsToVisit.splice(0,1)[0];
                    console.log("visiting global floor", goFloor);
                    elevator.goToFloor(goFloor.number);
                }
                else {
                    console.log("Still idle", floorsToVisit, elevator.floorsToVisit);
                    elevator.idle = true;
                }
            }
        }

        function processAllElevatorsMoves() {
            for (var i = 0; i < elevators.length; i++) {
                processElevatorMove(elevators[i]);
            }
        }

        function bindElevatorEvents(elevator) {
            elevator.floorsToVisit = [];

            elevator.on("floor_button_pressed", function(floorNum) {
                var newFloor = newFloorPush(floorNum);
                console.log("here is a floor0", newFloor);
                elevator.floorsToVisit.push(newFloor);
                processElevatorMove(elevator)
            });

            elevator.on("stopped_at_floor", function(floorNum) {
                this.floorsToVisit = this.floorsToVisit.filter(function (f) { return f.number != floorNum; });
                floorsToVisit = floorsToVisit.filter(function (f) { return f.number != floorNum; });
            })

            elevator.on("idle", function() {
                this.idle = true;
                processElevatorMove(this);
            });
        }

        for (var i = 0; i < elevators.length; i++) {
            bindElevatorEvents(elevators[i]);
        }

        for(var i = 0; i < floors.length; i++) {
            var floor = floors[i];

            floor.on("up_button_pressed", function() {
                floorsToVisit.push(newFloorPush(this.floorNum()));

                processAllElevatorsMoves();
            });

            floor.on("down_button_pressed", function() {
                floorsToVisit.push(newFloorPush(this.floorNum()));

                processAllElevatorsMoves();
            })
        }
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}