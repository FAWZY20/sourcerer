import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule} from '@angular/material/table';
import { MatToolbarModule} from '@angular/material/toolbar';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatTableModule
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            headers: new HttpHeaders().set("authorization", 'Bearer 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'),
            uri: 'https://api.github.com/graphql',
          }),
        };
      },
      deps: [HttpLink],
    },
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
