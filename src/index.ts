import { promises as fs } from "fs";
import os from "os";
import * as fsWalk from "@nodelib/fs.walk";
import { TFState } from "./tf_state";

const resources_to_locate: string[] = [
  "aws_subnet",
  "aws_default_network_acl",
  "aws_network_acl",
  "aws_vpc",
  "aws_internet_gateway",
  "aws_default_route_table",
  "aws_backup_plan",
  "aws_backup_vault",
  "aws_default_security_group",
  "aws_route_table",
];

const found: Map<string, string[]> = new Map();

async function run(): Promise<void> {
  const path_to_states =
    os.homedir() + "/Projects/resource-finder/micro-dev-states/environment/";

  fsWalk.walk(path_to_states, async (error, entry) => {
    if (error) {
      console.error(error);
      return;
    }

    entry.forEach(async (entry) => {
      if (!entry.dirent.isDirectory()) {
        const state_contents = await fs.readFile(entry.path, "utf8");
        const state_data: TFState = JSON.parse(state_contents);
        const feat_env_name = entry.path
          .substring(path_to_states.length)
          .split("/")[0];

        if (state_data.resources.length > 0) {
          state_data.resources.forEach((resource) => {
            if (resource.mode === "managed") {
              if (resources_to_locate.includes(resource.type)) {
                resource.instances.forEach((instance) => {
                  const key = `${feat_env_name}_${resource.type}`;
                  if (instance.attributes.arn) {
                    if (found.has(key)) {
                      let current = found.get(key);
                      if (current) {
                        current.push(instance.attributes.arn);
                      } else {
                        current = [instance.attributes.arn];
                      }
                      found.set(key, current);
                    } else {
                      found.set(key, [instance.attributes.arn]);
                    }
                  }
                });
              }
            }
          });
        } else {
          found.set(feat_env_name, []);
        }

        console.log(found);
      }
    });
  });
}

run().catch(console.error);
