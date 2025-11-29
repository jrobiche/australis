import {
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/*
 * the ng-three-template by JohnnyDevNull is a useful reference for using ThreeJS in Angular
 * https://github.com/JohnnyDevNull/ng-three-template/blob/beb432f90f2355323225346bff22fe766aa1f89c/src/app/engine/engine.service.ts
 */

@Component({
  selector: 'app-game-boxart-scene',
  imports: [],
  templateUrl: './game-boxart-scene.component.html',
  styleUrl: './game-boxart-scene.component.sass',
})
export class GameBoxartSceneComponent implements OnChanges, OnDestroy, OnInit {
  @Input()
  autorotate: boolean;
  @Input()
  boxPlasticColor: number | string;
  @Input()
  defaultCoverColor: number | string;
  @Input()
  textureUrl: string | null;
  @ViewChild('rendererCanvasWrapper', { static: true })
  rendererCanvasWrapper: ElementRef<HTMLCanvasElement> =
    {} as ElementRef<HTMLCanvasElement>;

  #boxPlasticColor: number | string;
  #boxartMesh: THREE.Mesh;
  #camera: THREE.PerspectiveCamera;
  #controls: OrbitControls;
  #defaultCoverColor: number | string;
  #frameId: number | null;
  #renderer: THREE.WebGLRenderer;
  #scene: THREE.Scene;
  #textureUrl: string | null;

  constructor(private ngZone: NgZone) {
    this.autorotate = false;
    this.boxPlasticColor = 0x00ff00;
    this.defaultCoverColor = 0x7f7f7f;
    this.textureUrl = null;
    this.#boxPlasticColor = this.boxPlasticColor;
    this.#defaultCoverColor = this.defaultCoverColor;
    this.#frameId = null;
    this.#renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    this.#scene = new THREE.Scene();
    this.#textureUrl = this.textureUrl;
    this.#boxartMesh = new THREE.Mesh(
      new THREE.BoxGeometry(425, 600, 50),
      this.#defaultBoxartMaterial(),
    );
    this.#camera = new THREE.PerspectiveCamera(
      40,
      this.#renderer.domElement.width / this.#renderer.domElement.height,
      0.1,
      10000,
    );
    this.#controls = new OrbitControls(this.#camera, this.#renderer.domElement);
  }

  ngOnInit(): void {
    this.#camera.position.z = 1100;
    this.#scene.add(this.#camera);
    this.#scene.add(this.#boxartMesh);
    this.#animate();
    this.rendererCanvasWrapper.nativeElement.appendChild(
      this.#renderer.domElement,
    );
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        this.#resize(entry.contentRect.width, entry.contentRect.height);
      });
    });
    observer.observe(this.rendererCanvasWrapper.nativeElement);
  }

  ngOnChanges() {
    this.#updateBoxMaterial();
  }

  ngOnDestroy(): void {
    if (this.#frameId != null) {
      cancelAnimationFrame(this.#frameId);
    }
    this.#renderer.dispose();
    this.#frameId = null;
  }

  #animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.#render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.#render();
        });
      }
    });
  }

  #defaultBoxartMaterial(): THREE.MeshBasicMaterial[] {
    return [
      new THREE.MeshBasicMaterial({ color: this.#boxPlasticColor }),
      new THREE.MeshBasicMaterial({ color: this.#defaultCoverColor }),
      new THREE.MeshBasicMaterial({ color: this.#boxPlasticColor }),
      new THREE.MeshBasicMaterial({ color: this.#boxPlasticColor }),
      new THREE.MeshBasicMaterial({ color: this.#defaultCoverColor }),
      new THREE.MeshBasicMaterial({ color: this.#defaultCoverColor }),
    ];
  }

  #render(): void {
    if (this.autorotate) {
      this.#boxartMesh.rotation.y += 0.01;
    }
    this.#controls.update();
    this.#renderer.render(this.#scene, this.#camera);
    this.#frameId = requestAnimationFrame(() => {
      this.#render();
    });
  }

  #resize(width: number, height: number): void {
    this.#camera.aspect = width / height;
    this.#camera.updateProjectionMatrix();
    this.#renderer.setSize(width, height);
  }

  #updateBoxMaterial(): void {
    if (
      this.textureUrl == this.#textureUrl &&
      this.boxPlasticColor == this.#boxPlasticColor &&
      this.defaultCoverColor == this.#defaultCoverColor
    ) {
      return;
    }
    this.#textureUrl = this.textureUrl;
    this.#boxPlasticColor = this.boxPlasticColor;
    this.#defaultCoverColor = this.defaultCoverColor;
    if (this.textureUrl === null) {
      this.#boxartMesh.material = this.#defaultBoxartMaterial();
    } else {
      new THREE.TextureLoader().load(this.textureUrl, (texture) => {
        texture.anisotropy = this.#renderer.capabilities.getMaxAnisotropy();
        texture.colorSpace = THREE.SRGBColorSpace;
        const front = texture.clone();
        front.offset.set(475 / 900, 0);
        front.repeat.set(425 / 900, 1);
        const spine = texture.clone();
        spine.offset.set(425 / 900, 0);
        spine.repeat.set(50 / 900, 1);
        const rear = texture.clone();
        rear.repeat.set(425 / 900, 1);
        this.#boxartMesh.material = [
          new THREE.MeshBasicMaterial({ color: this.#boxPlasticColor }),
          new THREE.MeshBasicMaterial({ map: spine }),
          new THREE.MeshBasicMaterial({ color: this.#boxPlasticColor }),
          new THREE.MeshBasicMaterial({ color: this.#boxPlasticColor }),
          new THREE.MeshBasicMaterial({ map: front }),
          new THREE.MeshBasicMaterial({ map: rear }),
        ];
      });
    }
  }
}
