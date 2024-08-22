import { Injectable, OnDestroy, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { collectionData, Firestore, collection, doc, onSnapshot, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NoteListService implements OnDestroy {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  firestore: Firestore = inject(Firestore);
  // items$;
  // items;

  unsubNotes;
  unsubTrash;
  // unsubSingle;


  constructor() {
    // this.items$ = collectionData(this.getNotesRef());  //--> erstellt erst mal nur ein Observable-Objekt (hier muss man dann mit async arbeiten!)
    // this.items = this.items$.subscribe((list) => {     //--> extra Schritt subscribe damit auch regelmäßig neue Daten ausgelesen werden können!
    //   list.forEach(element => {
    //     console.log(element);
    //   })
    // });

    // this.unsubSingle = onSnapshot(this.getSingleDocRef('notes', 'dsa56rg456z65'), (element) => {   //ruft nur ein einzelnes Dokument (key-value Paar) von der Datenbank ab und loggt es aus!
    //   console.log(element);
    // });
    // this.unsubSingle();

    this.unsubNotes = this.subNotesList();    //speichert den Rückgabewert der onSnapshot-Methode in einer Variable, damit sie später unsubscribt werden kann! (muss im constructor passieren, ansonsten ist der Typ von unsubNotes nicht definiert!)
    this.unsubTrash = this.subTrashList();    //speichert den Rückgabewert der onSnapshot-Methode in einer Variable, damit sie später unsubscribt werden kann! (muss im constructor passieren, ansonsten ist der Typ von unsubTrash nicht definiert!)
  }


  async addNote(item:{}) {    //fügt Daten zu der definierten Sammlung hinzu!
    await addDoc(this.getNotesRef(), item).catch(
      (err) => {console.error(err);}
    ).then(
      (docRef) => {console.log("Document written with ID: ", docRef?.id);}  //mit docRef? wird es optional! Somit wird der Fehler von TS eliminiert!
    )
  }


  subNotesList() {    //ruft die Notes-Daten (Liste) von der Datenbank ab und speichert sie in das normalNotes-Array!
    return onSnapshot(this.getNotesRef(), (list) => {
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }
  
  
  subTrashList() {    //ruft die Trash-Daten (Liste) von der Datenbank ab und speichert sie in das trashNotes-Array!
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }


  setNoteObject(obj: any, id: string): Note {   //fügt dem Objekt die Datenstruktur eines Note-Datentypes hinzu!
    return {
      id: id || '',
      type: obj.type || 'note',
      title: obj.title || '',
      content: obj.content || '',
      marked: obj.marked || false
    }
  }


  ngOnDestroy(): void {   //unsubscribet die Datenströme wieder!
    // this.items.unsubscribe();
    this.unsubNotes();
    this.unsubTrash();
  }


  getNotesRef() {   //gibt eine Referenz auf die Collection/ Sammlung mit dem Pfad "notes" zurück!
    return collection(this.firestore, 'notes');
  }


  getTrashRef() {   //gibt eine Referenz auf die Collection/ Sammlung mit dem Pfad "trash" zurück!
    return collection(this.firestore, 'trash');
  }


  getSingleDocRef(colId:string, docId:string) {   //gibt eine Referenz auf ein einzelnes Dokument (key-value Paar) zurück!
    return doc(collection(this.firestore, colId), docId);
  }

}
