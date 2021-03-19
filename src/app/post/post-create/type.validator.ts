import { AbstractControl } from '@angular/forms';
import { Observable, Observer } from 'rxjs';

//asynchrono pa nam treba neki event da znamo kad akd pokrenemo
// iza : je specijalni povratni tip null means valid
//vracamo ili observable ili promise
//imace key properti a ne znaima nas ime
export const mimeType = (control: AbstractControl): Promise<{[key:string]:any}> | Observable <{[key:string]:any}> => {
  const file =control.value as File;
  const fileReader = new FileReader();
  //obserrver je alat kojim kontrolises kad ce boserbable da emituje nove podatke
   //loadend vs load loadend ima vise informacija o failu
  const frObs = Observable.create((observer: Observer<{[key:string]:any}>) => {
    fileReader.addEventListener('loadend', () => {
      const arr = new  Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
      let header = "";
      let isValid = false;
      for( let i=0; i< arr.length; i++){
        //16-> hexa
        header+=arr[i].toString(16);
      }
      switch (header) {
        case "89504e47":
          isValid = true;
          break;
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
          isValid = true;
          break;
        default:
          isValid = false; // Or you can use the blob.type as fallback
          break;
      }
      if(isValid) {
        observer.next(null);
      }
      else{
        observer.next({invalidType: true});
      }
      observer.complete();
    });
    fileReader.readAsArrayBuffer(file);
  });
  return frObs;
}
