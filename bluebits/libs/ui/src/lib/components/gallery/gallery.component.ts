import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'ui-gallery',
    templateUrl: './gallery.component.html',
    styles: []
})
export class GalleryComponent implements OnInit {
    selectedImage = '';
    @Input() images: string[] = [];

    ngOnInit(): void {
        if (this.images && this.images.length > 0) {
            this.selectedImage = this.images[0];
        }
    }

    changeSelectedImage(imageUrl: string) {
        this.selectedImage = imageUrl;
    }

    get hasImages() {
        return this.images?.length > 0;
    }
}
