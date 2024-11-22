

const fileText = document.getElementById('file');
const selectMode = document.getElementById('options');


let file;
const upload = document.getElementById('upload');

if (upload != null){
    upload.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (event) => {
            file = event.target.files[0];
            fileText.textContent = file.name;
        };
        input.click();
        
    });
}

const upload_convert = document.getElementById('upload_convert');

if(upload_convert != null){

    upload_convert.addEventListener('click', () => {

        if (file != null){
            const reader = new FileReader();
            reader.onload = () => {
                localStorage.setItem('imageBase64', reader.result);
                localStorage.setItem('mode', selectMode.value);
                window.location.href = 'result.html';
            };
            reader.readAsDataURL(file);
            

            window.location.href('result.html');
        }else{
            alert("Please upload a file before converting")
        }
    });

}

const backbtn = document.getElementById('back');

if(backbtn != null){

    document.getElementById('back').addEventListener('click', () => {

        window.history.back();
    });

}

const OGcanvas = document.getElementById('originalCanvas');
const ALcanvas = document.getElementById('alteredCanvas');

if (OGcanvas != null && ALcanvas != null){

    const imageFile = localStorage.getItem('imageBase64');
    const ctx = OGcanvas.getContext('2d');
    const ctx2 = ALcanvas.getContext('2d');
    const img = new Image();
    img.src = imageFile;
    img.onload = () => {
        ctx.drawImage(img, 0, 0, OGcanvas.width, OGcanvas.height);
        let mode = localStorage.getItem('mode');

        ctx2.drawImage(img, 0, 0, ALcanvas.width, ALcanvas.height);
        const imageData = ctx2.getImageData(0, 0, ALcanvas.width, ALcanvas.height);
        const data = imageData.data;

        if(mode == '1'){
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];     
                const g = data[i + 1];
                const b = data[i + 2]; 
                const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                data[i] = data[i + 1] = data[i + 2] = gray
            }
            ctx2.putImageData(imageData, 0, 0);
        }else{



            for (let y = 1; y < ALcanvas.height - 1; y++) {
                for (let x = 1; x < ALcanvas.width - 1; x++) {
                    // Get the average color of the 3x3 grid around the current pixel
                    let r = 0, g = 0, b = 0, a = 0;
                    let count = 0;
        
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            const idx = ((y + dy) * ALcanvas.width + (x + dx)) * 4;
                            r += data[idx];
                            g += data[idx + 1];
                            b += data[idx + 2];
                            a += data[idx + 3];
                            count++;
                        }
                    }
        
                    // Set the average color to the current pixel
                    const idx = (y * ALcanvas.width + x) * 4;
                    data[idx] = r / count;
                    data[idx + 1] = g / count;
                    data[idx + 2] = b / count;
                    data[idx + 3] = a / count;
                }
            }


            
            ctx2.putImageData(imageData, 0, 0);
        }
    };
}


