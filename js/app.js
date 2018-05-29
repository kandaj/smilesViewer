"use strict";

function AppViewModel() {
    var _this = this;

    var app = this;
    this.fileInvalid = ko.observable();
    this.fileInfo = ko.observable();
    this.xyzCoordinates = ko.observable("");
    this.loader = ko.observable("");
    this.resError = ko.observable("");
    this.clearData = function (model, e) {
        e.preventDefault();
        _this.reader.abort();
        _this.xyzCoordinates("");
        _this.fileInfo("");
        _this.fileInvalid("");
        _this.resError("");
    };
    this.acceptDrop = function (model, e) {
        var files = e.dataTransfer.files;
        var reader = new FileReader(model);
        app.reader = reader;
        reader.onload = function () {
            var text = reader.result.trim();
            app.vaildateFile(text);
            app.fileInfo(files[0].name);
        };
        reader.onerror = function (event) {
            alert(event.target.error.name);
        };

        reader.readAsText(files[0]);
    };

    this.dragover = function (model, e) {
        e.stopPropagation();
        e.preventDefault();
    };

    this.vaildateFile = function (text) {
        var lines = text.split(/\r\n|\n|\s/);
        !lines[0] || lines.length > 1 ? _this.fileInvalid(true) : _this.fileInvalid(false);
        if (!app.fileInvalid()) {
            _this.loader(true);
            console.log("SMILES" + text);
            _this.getCoordinates(text).then(function (data) {
                _this.generate3DModel();
                _this.loader(false);
            });
        } else {
            _this.xyzCoordinates("");
        }
    };

    this.getCoordinates = function (text) {
        var smiles = btoa(text);
        var url = "https://www.ebi.ac.uk/chembl/api/utils/smiles2ctab/" + smiles;
        return axios.get(url).then(function (res) {
            var ctab = btoa(res.data);
            var url = "https://www.ebi.ac.uk/chembl/api/utils/ctab2xyz/" + ctab;
            return axios.get(url);
        }).then(function (res) {
            return _this.xyzCoordinates(res.data);
        }).catch(function (err) {
            console.log(err);
            _this.loader(false);
            _this.resError(true);
        });
    };

    this.generate3DModel = function () {
        var data = {
            containerId: 'renderContainer',
            canvasId: 'renderCanvas',
            resolution: 300,
            xyzCoordinates: _this.xyzCoordinates()
        };
        generateModel(data);
    };
}
//# sourceMappingURL=app.js.map
