function AppViewModel() {
    let app = this
    this.fileInvalid = ko.observable();
    this.fileInfo = ko.observable();
    this.xyzCoordinates = ko.observable("");
    this.loader = ko.observable("");
    this.clearData = (model, e) => {
        e.preventDefault();
        this.reader.abort()
        this.xyzCoordinates("")
        this.fileInfo("")
        this.fileInvalid("")
    }
    this.acceptDrop = (model, e) => {
        let files = e.dataTransfer.files;
        let reader = new FileReader(model);
        app.reader = reader
        reader.onload = function () {
            let text = reader.result.trim();
            app.vaildateFile(text)
            app.fileInfo('remove ' + files[0].name)
        };
        reader.onerror = (event) => {
            alert(event.target.error.name);
        };

        reader.readAsText(files[0]);

    };

    this.dragover = (model, e) => {
        e.stopPropagation();
        e.preventDefault();
    }

    this.vaildateFile = (text) => {
        const lines = text.split(/\r\n|\n|\s/);
        !lines[0] || lines.length > 1 ? this.fileInvalid(true) : this.fileInvalid(false)
        if (!app.fileInvalid()) {
            this.loader(true)
            console.log(`SMILES${text}`)
            this.getCoordinates(text).then(data => {
                this.generate3DModel()
                this.loader(false)
            })
        } else {
            this.xyzCoordinates("")
        }
    }

    this.getCoordinates = (text) => {
        const smiles  = btoa(text)
        let url = `https://www.ebi.ac.uk/chembl/api/utils/smiles2ctab/${smiles}`
        return axios.get(url)
            .then((res) => {
                const ctab = btoa(res.data)
                let url = `https://www.ebi.ac.uk/chembl/api/utils/ctab2xyz/${ctab}`
                return axios.get(url);
            })
            .then((res) => {
                return this.xyzCoordinates(res.data)
            })
            .catch((err) => {
                console.log(err)
            });
    }

    this.generate3DModel = () => {
        let data = {
            containerId: 'renderContainer',
            canvasId: 'renderCanvas',
            resolution: 300,
            xyzCoordinates: this.xyzCoordinates()
        }
        generateModel(data);
    }
}