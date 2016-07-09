{
    //Solves (sometimes multiple tries) 1-4, 8, 9, 10, 11, 16, 17
    //This is currently a mish mash file that I decided I should probably commit after I got to challenge 10 (it previously also solved 5, 6, and 7 too)
    init: function(elevators, floors) {
        var floorsToVisit = [];

        function processAllElevatorsMoves() {
            for (var i = 0; i < elevators.length; i++) {
                elevators[i].processMove();
            }
        }

        function bindElevatorEvents(elevator) {
            elevator.floorsToVisit = [];

            //Which floor am I closest to that I need to visit?
            elevator.getClosestFloorPush = function (floorsToVisit) {
                var closestFloorPush = 0,
                    currentFloor = this.currentFloor();
                
                for (var i = 0; i < floorsToVisit.length; i++) {
                    if (Math.abs(currentFloor - floorsToVisit[i]) < Math.abs(currentFloor - floorsToVisit[closestFloorPush])) {
                        closestFloorPush = i;
                    }
                }
                
                return floorsToVisit[closestFloorPush];
            }

            //Figure out what the elevator is going to do next
            elevator.processMove = function () {
                if (!this.idle) {
                    return;
                }

                this.idle = false;

                if (this.floorsToVisit.length) {
                    var goFloor = this.getClosestFloorPush(this.floorsToVisit);

                    console.log("visiting elevator floor", goFloor);

                    this.goToFloor(goFloor);
                }
                else if (floorsToVisit.length) {
                    var goFloor = this.getClosestFloorPush(floorsToVisit);// floorsToVisit.splice(0,1)[0];
                    floorsToVisit.splice(floorsToVisit.indexOf(goFloor),1);

                    console.log("visiting global floor", goFloor);
                    this.goToFloor(goFloor);
                }
                else {
                    console.log("Still idle", floorsToVisit, this.floorsToVisit);
                    this.idle = true;
                }
            }

            //Tell the elevator to go to a floor if someone wants to
            elevator.on("floor_button_pressed", function(floorNum) {
                elevator.floorsToVisit.push(floorNum);
                elevator.processMove();
            });

            //If we have stopped at a floor, everyone who needs to gets off and anyone on the floor gets on (if there are too many for the elevator, they will push the button again and get re-added)
            elevator.on("stopped_at_floor", function(floorNum) {
                this.floorsToVisit = this.floorsToVisit.filter(function (f) { return f != floorNum; });
                floorsToVisit = floorsToVisit.filter(function (f) { return f != floorNum; });
            })

            //If the elevator is idle, make it do something
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

            //Whenever someone is waiting on a floor, push it onto the global job queue and if elevators are free, have them go there
            floor.on("up_button_pressed down_button_pressed", function() {
                floorsToVisit.push(this.floorNum());

                processAllElevatorsMoves();
            });
        }
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}