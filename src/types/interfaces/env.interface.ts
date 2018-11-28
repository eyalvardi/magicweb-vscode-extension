//import { MagicMetadata, MagicPaths } from "../../schematics/magic-utils/metadata.class";
import { AppJson } from "../index";

export interface IEnv{
  workspace    : Workspace,
  project      : Project,
  metadata     : any, //MagicMetadata;
  componentsGen: string[];
  app          : AppJson;
  paths?       : any;
  prevent_log  : boolean;
}

/** An Angular CLI Workspacer config (angular.json) */
export interface Workspace {
  /** Link to schema. */
  $schema?: string;
  /** Workspace Schema version. */
  version: number;
  /** New project root. */
  newProjectRoot?: string;
  /** Tool options. */
  cli?: {
    /** Link to schema. */
    $schema?: string;
    [k: string]: any;
  };
  /** Tool options. */
  schematics?: {
    /** Link to schema. */
    $schema?: string;
    [k: string]: any;
  };
  /** Tool options. */
  architect?: {
    /** Link to schema. */
    $schema?: string;
    [k: string]: any;
  };
  /** A map of project names to project options. */
  projects: {
    [k: string]: Project;
  };
}


/**
 * A project in an Angular CLI workspace (e.g. an app or a library). A single workspace
 * can house multiple projects.
 */
export interface Project {
  name: string;

  /** Project type. */
  projectType: 'application' | 'library';
  /** Root of the project sourcefiles. */
  root: string;
  /** Tool options. */
  cli?: {
    /** Link to schema. */
    $schema?: string;
    [k: string]: any;
  };
  /** Tool options. */
  schematics?: {
    /** Link to schema. */
    $schema?: string;
    [k: string]: any;
  };
  /** Tool options. */
  architect?: any; //ProjectBuildOptions;
}

