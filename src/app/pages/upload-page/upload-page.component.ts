import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BlobReader, BlobWriter, Entry, TextWriter, ZipReader } from '@zip.js/zip.js';
import { CreatePageRequest } from '../../models/telegraph/requests/create-page-request';
import { Node } from '../../models/telegraph/types';
import { AuthService } from '../../services/auth.service';
import { TelegraphSdkService } from '../../services/telegraph-sdk.service';

@Component({
  templateUrl: './upload-page.component.html',
  styleUrls: ['./upload-page.component.scss']
})
export class UploadPageComponent {
  private readonly toastService = inject(HotToastService);
  private readonly telegraphSdkService = inject(TelegraphSdkService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  @ViewChild('fileInput') private fileInput?: ElementRef<any>;

  public archiveEntryItems: Array<SortableEntryListItem> = [];

  public async processArchive(event: any): Promise<void> {
    const archive: File = event.target.files[0];

    const zipFileReader = new BlobReader(archive);

    try {
      const zipReader = new ZipReader(zipFileReader);
      const entries = await zipReader.getEntries();

      this.archiveEntryItems.length = 0;
      let index = 0;
      console.log()
      for (const entry of entries) {
        this.archiveEntryItems.push({
          entry,
          index
        });
        index++;
      }
    } catch (error) {
      this.toastService.error(`Error reading archive: ${error}`);
    }
  }

  public removeFile(file: SortableEntryListItem): void {
    this.archiveEntryItems.splice(file.index, 1);
    this.archiveEntryItems.forEach((f, i) => { f.index = i});

    if (this.archiveEntryItems.length === 0 && this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = null;
    }
  }

  public onListSorted(sorted: unknown[]): void {
    this.archiveEntryItems = sorted as SortableEntryListItem[];

    this.archiveEntryItems.forEach(
        (item, index) => {
          item.index = index;
        }
    );
  }

  public async uploadFiles(): Promise<void> {
    const blobs: Array<Blob> = [];

    for (let item of this.archiveEntryItems) {
      const entry = item.entry;
      const blob = await entry.getData!(new BlobWriter());
      blobs.push(blob);
    }

    if (blobs.length === 0) {
      return;
    }

    this.telegraphSdkService
      .uploadFiles(blobs)
      .subscribe({
        next: files => {
          this.toastService.success('Files uploaded');
          const createPageRequest: CreatePageRequest = {
            title: 'TODO: Edit',
            access_token: this.authService.getAccessToken()!,
            content: files.map(f => {
              return {
                tag: 'img',
                attrs: {
                  src: `https://telegra.ph${f[0].src}`
                }
              } as Node;
            })
          };
          this.telegraphSdkService.createPage(createPageRequest).subscribe({
            next: p => {
              void this.router.navigate([''])
              window.open(p.result?.url, '_blank');
            }
          })
        },
        error: this.toastService.error
      });
  }
}

export interface SortableEntryListItem {
  index: number;
  entry: Entry;
}
