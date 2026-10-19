
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

  completed = false;
  completedFileName = '';
  completedTitle = '';
  completedMessage = '';
  completedSymbol = '';

  // TEMPORARY: bypass actual file deletion while developing the UI.
  // Set to false when we are ready to restore real deletion.
  bypassDeletion = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.method = this.route.snapshot.paramMap.get('method') || '';
    this.setMethodExperience();
  }

  async selectFile(): Promise<void> {
    try {
      const [fileHandle] = await (window as any).showOpenFilePicker({
        multiple: false
      });

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

      // TEMPORARY BYPASS
      if (this.bypassDeletion) {
        this.completedFileName = fileHandle.name;
        this.setCompletionExperience();

        this.completed = true;
        this.selectedFile = null;

        return;
      }

      // Request write permission only when the user confirms
      // the final disposition.
      const permission = await fileHandle.requestPermission({
        mode: 'readwrite'
      });

      if (permission !== 'granted') {
        console.log('Write permission was not granted.');
        return;
      }

      // Delete the selected local file.
      await fileHandle.remove();

      this.completedFileName = fileHandle.name;
      this.setCompletionExperience();

      this.completed = true;
      this.selectedFile = null;

    } catch (error) {
      console.error('Unable to complete disposition:', error);
    }
  }

  private setMethodExperience(): void {
    switch (this.method) {
      case 'ravana':
        this.completedSymbol = '🔥';
        break;
      case 'jal':
        this.completedSymbol = '🌊';
        break;

      case 'agni':
        this.completedSymbol = '🔥';
        break;

      case 'bhumi':
        this.completedSymbol = '🌱';
        break;

      case 'other':
        this.completedSymbol = '✨';
        break;

      case 'trash':
        this.completedSymbol = '🗑️';
        break;

      case 'ravana':
        this.completedSymbol = '🔥';
        break;

      default:
        this.completedSymbol = '✓';
    }
  }

  private setCompletionExperience(): void {
    switch (this.method) {
      case 'ravana':
        this.completedSymbol = '🔥';
        this.completedTitle = 'Ravana Dahan Complete!';
        this.completedMessage =
          'Your digital Ravana has met its end. May your disk have a little more room for what matters.';
        break;
      case 'jal':
        this.completedSymbol = '🌊';
        this.completedTitle = 'Immersion Complete';
        this.completedMessage =
          'Your grantha has been immersed.';
        break;

      case 'agni':
        this.completedSymbol = '🔥';
        this.completedTitle = 'Agni Complete';
        this.completedMessage =
          'Your grantha has been offered to Agni.';
        break;

      case 'bhumi':
        this.completedSymbol = '🌱';
        this.completedTitle = 'Return to Bhumi';
        this.completedMessage =
          'Your grantha has been returned to Bhumi.';
        break;

      case 'other':
        this.completedSymbol = '✨';
        this.completedTitle = 'Final Disposition Complete';
        this.completedMessage =
          'Your grantha has received its final disposition.';
        break;

      case 'trash':
        this.completedSymbol = '🗑️';
        this.completedTitle = 'Done';
        this.completedMessage =
          'Gone. No ceremony necessary.';
        break;

      case 'ravana':
        this.completedSymbol = '🔥';
        this.completedTitle = 'Ravana Dahan Complete!';
        this.completedMessage =
          'Your digital Ravana has met its end. May your disk have a little more room for what matters.';
        break;

      default:
        this.completedSymbol = '✓';
        this.completedTitle = 'Final Disposition Complete';
        this.completedMessage =
          'Your grantha has reached its final disposition.';
    }
  }
}
