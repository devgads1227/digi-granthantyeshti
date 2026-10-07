import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-disposal',
  templateUrl: './disposal.component.html',
  styleUrls: ['./disposal.component.scss']
})
export class DisposalComponent implements OnInit {

  method = '';
  selectedFile: FileSystemFileHandle | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.method = this.route.snapshot.paramMap.get('method') || '';
  }
async selectFile(): Promise<void> {
  try {
    const [fileHandle] = await (window as any).showOpenFilePicker({
      multiple: false
    });
/* chrome issue 
    const permission = await fileHandle.requestPermission({
      mode: 'readwrite'
    });

    if (permission !== 'granted') {
      console.log('File permission was not granted.');
      return;
    }
*/
    this.selectedFile = fileHandle;

  } catch (error) {
    console.log('File selection cancelled or unavailable.');
  }
}
  
  
  async confirmDisposition(): Promise<void> {
  if (!this.selectedFile) {
    return;
  }

  try {
    const fileHandle = this.selectedFile as any;

    const permission = await fileHandle.requestPermission({
      mode: 'readwrite'
    });

    if (permission !== 'granted') {
      console.log('File permission was not granted.');
      return;
    }

    await fileHandle.remove();

    console.log('Disposition completed:', fileHandle.name);

    this.selectedFile = null;

  } catch (error) {
    console.error('Unable to complete disposition:', error);
  }
}
}