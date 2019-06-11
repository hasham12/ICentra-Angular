import { environment } from 'src/environments/environment';
export class LibraryHelper {
  constructor() {
   }
  public baseUrl = environment.apiUrl + '/' + environment.api_prefix;
  public fileThumbbyType(file) {
    if (file.file_type === 'application/pdf') {
      if(file.thumb==''){
        return 'assets/img/icons/library/pdf.png';
      }else{  
        return file.thumb;
      }
    } else if (file.file_type === 'image/png') {
      return file.file_path;
    } else if(file.file_type === 'image/svg+xml') {
      return file.file_path;
    } else if (file.file_type === 'image/jpeg') {
      return file.file_path;
    } else if (file.file_type === 'image/jpg') {
      return file.file_path;
    } else if (file.file_type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return 'assets/img/icons/library/doc.png';
    } else if (file.file_type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return 'assets/img/icons/library/xls.png';
    }else if (file.file_type === 'application/vnd.ms-powerpoint') {
      return 'assets/img/icons/library/ppt.png';
    } else if (file.file_type === 'application/x-zip-compressed') {
      return 'assets/img/icons/library/zip.png';
    } else if (file.file_type === 'text/html') {
      return 'assets/img/icons/library/html.png';
    }else if (file.file_type === 'text/plain') {
      return 'assets/img/icons/library/txt.png';
    }else if (file.file_type === 'application/json') {
      return 'assets/img/icons/library/json.png';
    }else if (file.file_type === 'text/xml') {
      return 'assets/img/icons/library/xml.png';
    }else {
      return 'assets/img/icons/library/file.png';
    }
  }
  fileThumbbyName(file) {
    if (file.type === 'application/pdf') {
      if(file.thumb==undefined || file.thumb==''){
        return 'assets/img/icons/library/pdf.png';
      }else{  
        return file.thumb;
      }
    } else if (file.type === 'image/png') {
      return 'assets/img/icons/library/png.png';
    } else if (file.type === 'image/jpeg') {
      return 'assets/img/icons/library/jpg.png';
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return 'assets/img/icons/library/doc.png';
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return 'assets/img/icons/library/xls.png';
    } else if (file.type === 'application/vnd.ms-powerpoint') {
      return 'assets/img/icons/library/ppt.png';
    } else if (file.type === 'application/x-zip-compressed') {
      return 'assets/img/icons/library/zip.png';
    } else if (file.type === 'text/html') {
      return 'assets/img/icons/library/html.png';
    } else if (file.type === 'text/plain') {
      return 'assets/img/icons/library/txt.png';
    } else if (file.type === 'application/json') {
      return 'assets/img/icons/library/json.png';
    } else if (file.type === 'text/xml') {
      return 'assets/img/icons/library/xml.png';
    } else {
      return 'assets/img/icons/library/file.png';
    }
  }

  downloadFile(path){
    window.location.href = this.baseUrl + '/library/download?path=' + path;
  }
  fileExtension(file_name){
    return file_name.split('.').pop().toUpperCase();
  }
}
