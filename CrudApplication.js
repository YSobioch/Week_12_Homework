class Desk {
    constructor(name){
        this.name = name;
        this.hardware = [];
    }

    addhardware(type, model) {
        this.hardware.push(new hardware(type, model));
    }
}

class Hardware {
    constructor(type, model){
        this.type = type;
        this.model = model
    }
}

class DeskService {
    static url = "https://crudcrud.com/api/23cc375171b7489d9c14bc246a97378a"

    static getALLDesks() {
        return $.get(this.url);
    }

    static getDesk(id){
        return $.get(this.url + `/${id}`);
    }

    static createDesk(desk) {
        return $.post(this.url, desk);
    }

    static updateDesk(desk) {
        return $.ajax({
            url: this.url + `/${desk._id}`,
            dataType: 'json',
            data: JSON.stringify(desk),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteDesk(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

class DOMManager {
    static desks;

    static getALLDesks(){
        DeskService.getALLDesks().then(desks => this.render(desks));
    }

    static createDesk(name) {
        DeskService.createDesk(new Desk(name))
        .then(() => {
            return DeskService.getALLDesks();
        })
        .then((desks) => this.render(desks));
    }

    static deleteDesk(id) {
        DeskService.deleteDesk(id)
            .then(() => {
                return DeskService.getALLDesks();
            })
            .then((desks) => this.render(desks));
    }
    
    static addhardware(id){
        for(let desk of this.desks) {
            if (desk._id == id) {
                desk.hardware.push(new Hardware($(`#${desk._id}-hardware-type`).val(), $(`#${desk._id}-hardware-model`).val()));
                DeskService.updateDesk(desks)
                    .then(() => {
                        return DeskService.getALLDesks();
                    })
                    .then((desks) => this.render(desks));
            }
        }
    }

    static deleteHardware(deskId, hardwareId){
        for(let desk of this.desks){
            if (desk._id == deskId) {
                for (let hardware of desk.hardware) {
                    if (hardware._id == hardwareId) {
                        desk.hardware.splice(desk.hardware.indexOf(hardware), 1);
                        DeskService.updateDesk(desk)
                        .then(() => {
                            return DeskService.getALLDesks
                        })
                        .then((desks) => this.render(desks))
                    }
                }
            }
        }
    }

    static render(desks){
        this.desks = desks;
        $('#app').empty();
        for(let desk of desks){
            $('#app').prepend(
                `<div id="${desk._id}" class="card">
                    <div class="card-header">
                        <h2>${desk.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteDesk('${desk._id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${desk._id}-hardware-name" class="form-control" placeholder="Hardware Type">
                                </div>
                                <div class="col-sm">
                                    <input type="text" id="${desk._id}-hardware-name" class="form-control" placeholder="Hardware Model">
                                </div>
                            </div>
                            <button id="${desk._id}-new-hardware" onclick=DOMManager.addHardware('${desk._id}')" class="btn btn-primary form-control">Add</button>
                        </div>
                    </div>
                </div> <br>       
                `
            );

            for(let hardware of desk.hardware){
                $(`#${desk._id}`).find('.card-body').append(
                  `<p>
                    <span id="type-${hardware._id}"><strong>Type: </strong> ${hardware.type}</span>
                    <span id="model-${hardware._id}"><strong>Model: </strong> ${hardware.model}</span>
                    <button class="btn btn-danger" onclick="DOMManager.deleteHardware('${desk._id}', '${hardware._id}')">Delete Hardware</button>
                    `  
                );
            }
        }
    }


}

$('#create-new-desk').click(() => {
    DOMManager.createDesk($('#new-desk-name').val());
    $('#new-desk-name').val('');
});

DOMManager.getALLDesks();
