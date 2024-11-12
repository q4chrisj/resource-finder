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
    os.homedir() + "/Projects/_todo/micro-dev-states/environment/";

  fsWalk.walk(path_to_states, async (error, entry) => {
    if (error) {
      console.error(error);
      return;
    }

    entry.forEach(async (entry) => {
      if (!entry.dirent.isDirectory()) {
        const state_contents = await fs.readFile(entry.path, "utf8");
        const state_data: TFState = JSON.parse(state_contents);

        if (state_data.resources.length > 0) {
          state_data.resources.forEach((resource) => {
            if (resource.mode === "managed") {
              if (resources_to_locate.includes(resource.type)) {
                resource.instances.forEach((instance) => {
                  if (instance.attributes.arn) {
                    if (found.has(resource.type)) {
                      let current = found.get(resource.type);
                      if (current) {
                        current.push(instance.attributes.arn);
                      } else {
                        current = [instance.attributes.arn];
                      }
                      found.set(resource.type, current);
                    } else {
                      found.set(resource.type, [instance.attributes.arn]);
                    }
                  }
                });
              }
            }
          });
        }

        console.log(found);
      }
    });
  });
}

run().catch(console.error);
