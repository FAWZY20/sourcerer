import { query } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewRef, ViewChild } from '@angular/core';
import { Apollo, gql, Query } from 'apollo-angular';
import { map } from 'rxjs/operators';
import internal from 'stream';
import { Chart } from 'chart.js';
import { DataSource } from '@angular/cdk/collections';
import { Observable, of, SchedulerLike } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Pipe, PipeTransform } from '@angular/core';


const GET_FEED = gql`
  query Getlogin {
    viewer { 
      login
      name
      avatarUrl
      company
      location
      repositories{
        totalCount
      }
      followers{
        totalCount
      }
      following{
        totalCount
      }
      contributionsCollection{
        totalCommitContributions
      }
    }
  }
`;

const GET_INFO_REPO = gql`
  query GetInfoRepo {
    viewer{
      repositories(first: 100){
        nodes{
          name
         }
      }
    }
  }
`;

const GET_INFO_LANGUAGE = gql`
  query GetInfoLanguage{ 
    viewer { 
      repositories(first: 10) {
        nodes {
          primaryLanguage {
            name
            color
          }
        }
      }
    }
  }
`;

const GET_INFO_REPO_USER = gql`
query GetInfoLanguageRepo($repoName: String!){ 
  viewer { 
    repository(name: $repoName){
      description
      resourcePath
      languages(first: 5){
        nodes{
          name
          color
        }
      }
      collaborators{
        nodes{
          avatarUrl
          name
        }
      }
      primaryLanguage{
        name
      }
    }
  }
}
`;



const GET_UPDATE_REPO = gql`
  query GetLastUptade {
      viewer{
        repositories(last: 1 ){
            nodes{
              updatedAt
            }
        }
      }
    }
`;

const GET_REPO_NAME = gql`
    query GetRepoName { 
      viewer { 
        repositories(first: 100){
          nodes{
            name
          }
        }
      }
    }
`;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class HomeComponent implements OnInit {

  displayedColumns = ['position', 'repository', 'commits', 'team', 'language', 'timeline'];
  dataSource = new ExampleDataSource();

  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any;

  data!: Observable<any>;
  repositoriesInfo: any;
  login: any;
  name: any;
  avatarUrl: any;
  company: any;
  location: any;
  repositories: any;
  follower: any;
  following: any;
  commit: any;
  repositoryPrimaryLanguage!: any;
  repositoriesUpdate!: any;
  repoLanguage: any;
  repoName: any;
  repoColab: any;
  repoPath: any;
  repositoryInfoLanguage: any;
  repoDescription: any;

  constructor(private apollo: Apollo) { }


  ngOnInit() {

    this.apollo
      .watchQuery({ query: GET_FEED })
      .valueChanges
      .subscribe(({ data }: any) => {
        this.name = data.viewer.name;
        this.login = data.viewer.login;
        this.company = data.viewer.company;
        this.location = data.viewer.location;
        this.avatarUrl = data.viewer.avatarUrl;
        this.repositories = data.viewer.repositories.totalCount;
        this.follower = data.viewer.followers.totalCount;
        this.following = data.viewer.following.totalCount;
        this.commit = data.viewer.contributionsCollection.totalCommitContributions;
      });

    this.repositoriesUpdate = this.apollo
      .watchQuery({ query: GET_UPDATE_REPO })
      .valueChanges.pipe(map(({ data }: any) => data.viewer.repositories.nodes));

    this.repoName = this.apollo
      .watchQuery({ query: GET_REPO_NAME })
      .valueChanges.pipe(map(({ data }: any) => data.viewer.repositories.nodes));

    this.repoColab = this.apollo
      .watchQuery({
        query: GET_INFO_REPO_USER, variables: {
          repoName: "sourcerer"
        },
      })
      .valueChanges.pipe(map(({ data }: any) => data.viewer.repository.collaborators.nodes));

     this.repositoryInfoLanguage = this.apollo
       .watchQuery({ query: GET_INFO_LANGUAGE })
       .valueChanges.pipe(map(({ data }: any) => data.viewer.repositories.nodes));

    this.repoLanguage = this.apollo
      .watchQuery({
        query: GET_INFO_REPO_USER, variables: {
          repoName: "sourcerer"
        },
      })
      .valueChanges.pipe(map(({ data }: any) => data.viewer.repository.languages.nodes));

    this.repoPath = this.apollo
      .watchQuery({
        query: GET_INFO_REPO_USER, variables: {
          repoName: "sourcerer"
        },
      })
      .valueChanges.subscribe(({ data }: any) => {
        this.repoPath = data.viewer.repository.resourcePath;
        this.repositoryPrimaryLanguage = data.viewer.repository.primaryLanguage.name; 
        this. repoDescription = data.viewer.repository.description;
      });


  }


  canvas: any;
  ctx: any;
  @ViewChild('mychart') mychart: any;

  canvase: any;
  ctt: any;
  @ViewChild('mycharte') mycharte: any;

  ngAfterViewInit() {


    // graph line

    this.canvas = this.mychart.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: ['January 2019', 'February 2019', 'March 2019', 'April 2019'],

        datasets: [{
          // label: this.primaryLanguage,
          data: [0, 20, 40, 50],
          backgroundColor: "#067a6b",
          fill: true,
        },
        {
          label: 'Invested Amount',
          data: [30, 20, 40, 60, 80],
          backgroundColor: "#47a0e8",
          fill: true,
        }],

      },

      options: {
        legend: {
          display: false
        }
      }

    });


    // Graph cercle

    this.canvase = this.mycharte.nativeElement;
    this.ctt = this.canvase.getContext('2d');

    new Chart(this.ctt, {
      type: 'doughnut',
      data: {
        datasets: [{
          label: 'My First Dataset',
          data: [300, 50, 100],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          //hoverOffset: 4
        }]
      },
    });
  }

}


export interface Element {
  repository: string;
  position: number;
  commits: number;
  team: number;
  language: string;
  timeline: number;

}

const data: Element[] = [

  {
    position: 1,
    repository: 'sourcerer',
    commits: 10,
    team: 1,
    language: 'typescript',
    timeline: 1
  }
];

/**
 * Data source to provide what data should be rendered in the table. The observable provided
 * in connect should emit exactly the data that should be rendered by the table. If the data is
 * altered, the observable should emit that new set of data on the stream. In our case here,
 * we return a stream that contains only one set of data that doesn't change.
 */
export class ExampleDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Element[]> {
    const rows: any[] | SchedulerLike = [];
    data.forEach(element => rows.push(element, { detailRow: true, element }));
    console.log(rows);
    return of(rows);
  }

  disconnect() { }
}


/**  Copyright 2017 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */

