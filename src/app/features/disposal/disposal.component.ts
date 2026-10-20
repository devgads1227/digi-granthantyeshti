
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

type PreviewKind = 'image' | 'pdf' | 'video' | 'other';

@Component({
  selector: 'app-disposal',
  templateUrl: './disposal.component.html',
  styleUrls: ['./disposal.component.scss']
})
export class DisposalComponent implements OnInit, OnDestroy {

  method = '';

  selectedFile: FileSystemFileHandle | null = null;

  // Preview controls
  previewEnabled = true;
  animateDisposal = false;

  // Selected file preview
  previewKind: PreviewKind = 'other';
  previewUrl: string | null = null;

  isDissolving = false;
  isDisposing = false;

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

  ngOnDestroy(): void {
    this.clearPreview();
  }

  async selectFile(): Promise<void> {
    try {
      const [fileHandle] = await (window as any).showOpenFilePicker({
        multiple: false
      });

      if (!fileHandle) {
        return;
      }

      this.clearPreview();
      this.selectedFile = fileHandle;
      this.previewKind = 'other';

      try {
        const file: File = await fileHandle.getFile();
        this.preparePreview(file);
      } catch (error) {
        // Keep the selected file available even if preview reading fails.
        console.warn('Unable to prepare file preview:', error);
      }

    } catch (error) {
      // A cancelled picker leaves the existing selection unchanged.
      console.log('File selection cancelled or unavailable.');
    }
  }

  onPreviewToggle(event: Event): void {
    this.previewEnabled =
      (event.target as HTMLInputElement).checked;
  }

  onAnimationToggle(event: Event): void {
    this.animateDisposal =
      (event.target as HTMLInputElement).checked;

    // Animation behavior will be implemented in a later step.
  }

  private preparePreview(file: File): void {
    const name = file.name.toLowerCase();
    const type = (file.type || '').toLowerCase();

    if (
      type.startsWith('image/') ||
      /\.(png|jpe?g|gif|webp|bmp|svg|avif|ico)$/.test(name)
    ) {
      this.previewKind = 'image';
      this.previewUrl = URL.createObjectURL(file);
      return;
    }

    if (type === 'application/pdf' || name.endsWith('.pdf')) {
      this.previewKind = 'pdf';
      return;
    }

    if (
      type.startsWith('video/') ||
      /\.(mp4|webm|ogg|mov|m4v|avi|mkv|mpeg|mpg|3gp)$/.test(name)
    ) {
      this.previewKind = 'video';
      return;
    }

    this.previewKind = 'other';
  }

  private clearPreview(): void {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    }
  }
async confirmDisposition(): Promise<void> {
  if (!this.selectedFile || this.isDisposing) {
    return;
  }

  this.isDisposing = true;

  try {
    const fileHandle = this.selectedFile as any;

    // Demo bypass: animate, but do not delete the file.
    if (this.bypassDeletion) {
      await this.playDissolveIfRequested();

      this.completedFileName = fileHandle.name;
      this.setCompletionExperience();
      this.completed = true;
      this.selectedFile = null;
      this.clearPreview();
      return;
    }

    // Request permission before beginning the animation.
    const permission = await fileHandle.requestPermission({
      mode: 'readwrite'
    });

    if (permission !== 'granted') {
      console.log('Write permission was not granted.');
      return;
    }

    // Play the visual effect, if enabled.
    await this.playDissolveIfRequested();

    // Actual deletion remains the decisive operation.
    await fileHandle.remove();

    this.completedFileName = fileHandle.name;
    this.setCompletionExperience();
    this.completed = true;
    this.selectedFile = null;
    this.clearPreview();

  } catch (error) {
    console.error('Unable to complete disposition:', error);

    // Restore the preview if deletion fails.
    this.isDissolving = false;

  } finally {
    this.isDisposing = false;
  }
}

private async playDissolveIfRequested(): Promise<void> {
  if (!this.animateDisposal || !this.previewEnabled) {
    return;
  }

  this.isDissolving = true;

  // Allow the CSS animation to finish before attempting deletion.
  await new Promise<void>(resolve => setTimeout(resolve, 2000));
}

  private setMethodExperience(): void {
    switch (this.method) {
      case 'ravana':
      case 'agni':
        this.completedSymbol = '🔥';
        break;

      case 'jal':
        this.completedSymbol = '🌊';
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

      default:
        this.completedSymbol = '✓';
        this.completedTitle = 'Final Disposition Complete';
        this.completedMessage =
          'Your grantha has reached its final disposition.';
    }
  }
}
